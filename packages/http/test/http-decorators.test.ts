import { ModelProperty } from "@typespec/compiler";
import { expectDiagnosticEmpty, expectDiagnostics, t } from "@typespec/compiler/testing";
import { deepStrictEqual, ok, strictEqual } from "assert";
import { describe, expect, it } from "vitest";
import {
  getAuthentication,
  getCookieParamOptions,
  getHeaderFieldName,
  getHeaderFieldOptions,
  getPathParamName,
  getPathParamOptions,
  getQueryParamName,
  getQueryParamOptions,
  getServers,
  getStatusCodes,
  isBody,
  isBodyIgnore,
  isBodyRoot,
  isCookieParam,
  isHeader,
  isPathParam,
  isQueryParam,
  isStatusCode,
} from "../src/decorators.js";
import { includeInapplicableMetadataInPayload } from "../src/private.decorators.js";
import { Tester } from "./test-host.js";

describe("http: decorators", () => {
  describe("emit diagnostic if passing arguments to verb decorators", () => {
    ["get", "post", "put", "delete", "head"].forEach((verb) => {
      it(`@${verb}`, async () => {
        const diagnostics = await Tester.diagnose(`
          @${verb}("/test") op test(): string;
        `);

        expectDiagnostics(diagnostics, {
          code: "invalid-argument-count",
          message: "Expected 0 arguments, but got 1.",
        });
      });
    });

    it(`@patch`, async () => {
      const diagnostics = await Tester.diagnose(`
        @patch("/test") op test(): string;
        `);

      expectDiagnostics(diagnostics, {
        code: "invalid-argument",
        message: `Argument of type '"/test"' is not assignable to parameter of type 'valueof TypeSpec.Http.PatchOptions'`,
      });
    });
  });

  describe("@header", () => {
    it("emit diagnostics when @header is not used on model property", async () => {
      const diagnostics = await Tester.diagnose(`
          @header op test(): string;

          @header model Foo {}
        `);

      expectDiagnostics(diagnostics, [
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @header decorator to test since it is not assignable to ModelProperty",
        },
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @header decorator to Foo since it is not assignable to ModelProperty",
        },
      ]);
    });

    it("emit diagnostics when header name is not a string or of value HeaderOptions", async () => {
      const diagnostics = await Tester.diagnose(`
          op test(@header(123) MyHeader: string): string;
          op test2(@header(#{ name: 123 }) MyHeader: string): string;
          op test3(@header(#{ format: "invalid" }) MyHeader: string): string;
          op test4(@header(#{ explode: "invalid" }) MyHeader: string): string;
        `);

      expectDiagnostics(diagnostics, [
        {
          code: "invalid-argument",
        },
        {
          code: "invalid-argument",
        },
        {
          code: "invalid-argument",
        },
        {
          code: "invalid-argument",
        },
      ]);
    });

    it("generate header name from property name", async () => {
      const { MyHeader, program } = await Tester.compile(t.code`
          op test(@header ${t.modelProperty("MyHeader")}: string): string;
        `);

      ok(isHeader(program, MyHeader));
      strictEqual(getHeaderFieldName(program, MyHeader), "my-header");
    });

    it("override header name with 1st parameter", async () => {
      const { MyHeader, program } = await Tester.compile(t.code`
          op test( @header("x-my-header") ${t.modelProperty("MyHeader")}: string): string;
        `);

      strictEqual(getHeaderFieldName(program, MyHeader), "x-my-header");
    });

    it("override header with HeaderOptions", async () => {
      const { SingleString, program } = await Tester.compile(t.code`
          @put op test(@header(#{name: "x-single-string"}) ${t.modelProperty("SingleString")}: string): string;
        `);

      deepStrictEqual(getHeaderFieldOptions(program, SingleString), {
        type: "header",
        name: "x-single-string",
      });
      strictEqual(getHeaderFieldName(program, SingleString), "x-single-string");
    });

    it("specify explode", async () => {
      const { MyHeader, program } = await Tester.compile(t.code`
        @put op test(@header(#{ explode: true }) ${t.modelProperty("MyHeader")}: string): string;
      `);

      deepStrictEqual(getHeaderFieldOptions(program, MyHeader), {
        type: "header",
        name: "my-header",
        explode: true,
      });
      strictEqual(getHeaderFieldName(program, MyHeader), "my-header");
    });
  });

  describe("@cookie", () => {
    it("emit diagnostics when @cookie is not used on model property", async () => {
      const diagnostics = await Tester.diagnose(`
          @cookie op test(): string;

          @cookie model Foo {}
        `);

      expectDiagnostics(diagnostics, [
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @cookie decorator to test since it is not assignable to ModelProperty",
        },
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @cookie decorator to Foo since it is not assignable to ModelProperty",
        },
      ]);
    });

    it("emit diagnostics when cookie name is not a string or of type CookieOptions", async () => {
      const diagnostics = await Tester.diagnose(`
          op test(@cookie(123) myCookie: string): string;
          op test2(@cookie(#{ name: 123 })myCookie: string): string;
          op test3(@cookie(#{ format: "invalid" }) myCookie: string): string;
        `);

      expectDiagnostics(diagnostics, [
        {
          code: "invalid-argument",
        },
        {
          code: "invalid-argument",
        },
        {
          code: "invalid-argument",
        },
      ]);
    });

    it("generate cookie name from property name", async () => {
      const { myCookie, program } = await Tester.compile(t.code`
          op test(@cookie ${t.modelProperty("myCookie")}: string): string;
        `);

      ok(isCookieParam(program, myCookie));
      strictEqual(getCookieParamOptions(program, myCookie)?.name, "my_cookie");
    });

    it("override cookie name with 1st parameter", async () => {
      const { myCookie, program } = await Tester.compile(t.code`
          op test(@cookie("my-cookie") ${t.modelProperty("myCookie")}: string): string;
        `);

      strictEqual(getCookieParamOptions(program, myCookie)?.name, "my-cookie");
    });

    it("override cookie with CookieOptions", async () => {
      const { myCookie, program } = await Tester.compile(t.code`
          op test(@cookie(#{name: "my-cookie"}) ${t.modelProperty("myCookie")}: string): string;
        `);

      strictEqual(getCookieParamOptions(program, myCookie)?.name, "my-cookie");
    });
  });

  describe("@query", () => {
    it("emit diagnostics when @query is not used on model property", async () => {
      const diagnostics = await Tester.diagnose(`
          @query op test(): string;

          @query model Foo {}
        `);

      expectDiagnostics(diagnostics, [
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @query decorator to test since it is not assignable to ModelProperty",
        },
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @query decorator to Foo since it is not assignable to ModelProperty",
        },
      ]);
    });

    it("emit diagnostics when query name is not a string or of type QueryOptions", async () => {
      const diagnostics = await Tester.diagnose(`
          op test(@query(123) MyQuery: string): string;
          op test2(@query(#{name: 123}) MyQuery: string): string;
          op test3(@query(#{format: "invalid"}) MyQuery: string): string;
        `);

      expectDiagnostics(diagnostics, [
        {
          code: "invalid-argument",
        },
        {
          code: "invalid-argument",
        },
        {
          code: "invalid-argument",
        },
      ]);
    });

    it("generate query name from property name", async () => {
      const { select, program } = await Tester.compile(t.code`
          op test(@query ${t.modelProperty("select")}: string): string;
        `);

      ok(isQueryParam(program, select));
      strictEqual(getQueryParamName(program, select), "select");
    });

    it("override query name with 1st parameter", async () => {
      const { select, program } = await Tester.compile(t.code`
          op test(@query("$select") ${t.modelProperty("select")}: string): string;
        `);

      strictEqual(getQueryParamName(program, select), "$select");
    });

    it("specify explode: true", async () => {
      const { selects, program } = await Tester.compile(t.code`
        op test(@query(#{ explode: true }) ${t.modelProperty("selects")}: string[]): string;
      `);
      expect(getQueryParamOptions(program, selects)).toEqual({
        type: "query",
        name: "selects",
        explode: true,
      });
    });
  });

  describe("@route", () => {
    it("emit diagnostics when duplicated unshared routes are applied", async () => {
      const diagnostics = await Tester.diagnose(`
        @route("/test") op test(): string;
        @route("/test") op test2(): string;
      `);

      expectDiagnostics(diagnostics, [
        {
          code: "@typespec/http/duplicate-operation",
          message: `Duplicate operation "test" routed at "get /test".`,
        },
        {
          code: "@typespec/http/duplicate-operation",
          message: `Duplicate operation "test2" routed at "get /test".`,
        },
      ]);
    });

    it("emit diagnostics when not all duplicated routes are declared shared on each op conflicting", async () => {
      const diagnostics = await Tester.diagnose(`
        @route("/test") @sharedRoute op test(): string;
        @route("/test") @sharedRoute op test2(): string;
        @route("/test") op test3(): string;
      `);
      expectDiagnostics(diagnostics, [
        {
          code: "@typespec/http/shared-inconsistency",
          message: `Each operation routed at "get /test" needs to have the @sharedRoute decorator.`,
        },
        {
          code: "@typespec/http/shared-inconsistency",
          message: `Each operation routed at "get /test" needs to have the @sharedRoute decorator.`,
        },
        {
          code: "@typespec/http/shared-inconsistency",
          message: `Each operation routed at "get /test" needs to have the @sharedRoute decorator.`,
        },
      ]);
    });

    it("do not emit diagnostics when duplicated shared routes are applied", async () => {
      const diagnostics = await Tester.diagnose(`
        @route("/test") @sharedRoute op test(): string;
        @route("/test") @sharedRoute op test2(): string;
      `);

      expectDiagnosticEmpty(diagnostics);
    });

    it("do not emit diagnostics routes sharing path but not same verb", async () => {
      const diagnostics = await Tester.diagnose(`
        @route("/test") @sharedRoute op test(): string;
        @route("/test") @sharedRoute op test2(): string;
        @route("/test") @post op test3(): string;
      `);
      expectDiagnosticEmpty(diagnostics);
    });
  });

  describe("@path", () => {
    it("emit diagnostics when @path is not used on model property", async () => {
      const diagnostics = await Tester.diagnose(`
          @path op test(): string;

          @path model Foo {}
        `);

      expectDiagnostics(diagnostics, [
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @path decorator to test since it is not assignable to ModelProperty",
        },
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @path decorator to Foo since it is not assignable to ModelProperty",
        },
      ]);
    });

    it("accept optional path when specified at the root of @route", async () => {
      const diagnostics = await Tester.diagnose(`
        @route("{/myPath}") op test(@path myPath?: string): string;
      `);

      expectDiagnosticEmpty(diagnostics);
    });

    it("accept optional path when specified in route", async () => {
      const diagnostics = await Tester.diagnose(`
        @route("base{/myPath}") op test(@path myPath?: string): string;
      `);

      expectDiagnosticEmpty(diagnostics);
    });

    it("accept optional path when not used as operation parameter", async () => {
      const diagnostics = await Tester.diagnose(`
        @route("/") op test(): {@path myPath?: string};
      `);

      expectDiagnosticEmpty(diagnostics);
    });

    it("emit diagnostics when path name is not a string", async () => {
      const diagnostics = await Tester.diagnose(`
          op test(@path(123) MyPath: string): string;
        `);

      expectDiagnostics(diagnostics, [
        {
          code: "invalid-argument",
        },
      ]);
    });

    it("generate path name from property name", async () => {
      const { select, program } = await Tester.compile(t.code`
          op test(@path ${t.modelProperty("select")}: string): string;
        `);

      ok(isPathParam(program, select));
      strictEqual(getPathParamName(program, select), "select");
    });

    it("override path name with 1st parameter", async () => {
      const { select, program } = await Tester.compile(t.code`
          op test(@path("$select") ${t.modelProperty("select")}: string): string;
        `);

      deepStrictEqual(getPathParamOptions(program, select), {
        type: "path",
        name: "$select",
        allowReserved: false,
        explode: false,
        style: "simple",
      });
      strictEqual(getPathParamName(program, select), "$select");
    });
  });

  describe("@body", () => {
    it("emit diagnostics when @body is not used on model property", async () => {
      const diagnostics = await Tester.diagnose(`
          @body op test(): string;

          @body model Foo {}
        `);

      expectDiagnostics(diagnostics, [
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @body decorator to test since it is not assignable to ModelProperty",
        },
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @body decorator to Foo since it is not assignable to ModelProperty",
        },
      ]);
    });

    it("set the body with @body", async () => {
      const { body, program } = await Tester.compile(t.code`
          @post op test(@body ${t.modelProperty("body")}: string): string;
        `);

      ok(isBody(program, body));
    });
  });

  describe("@bodyRoot", () => {
    it("emit diagnostics when @body is not used on model property", async () => {
      const diagnostics = await Tester.diagnose(`
          @bodyRoot op test(): string;

          @bodyRoot model Foo {}
        `);

      expectDiagnostics(diagnostics, [
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @bodyRoot decorator to test since it is not assignable to ModelProperty",
        },
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @bodyRoot decorator to Foo since it is not assignable to ModelProperty",
        },
      ]);
    });

    it("set the body root with @bodyRoot", async () => {
      const { body, program } = await Tester.compile(t.code`
          @post op test(@bodyRoot ${t.modelProperty("body")}: string): string;
        `);

      ok(isBodyRoot(program, body));
    });
  });

  describe("@bodyIgnore", () => {
    it("emit diagnostics when @body is not used on model property", async () => {
      const diagnostics = await Tester.diagnose(`
          @bodyIgnore op test(): string;

          @bodyIgnore model Foo {}
        `);

      expectDiagnostics(diagnostics, [
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @bodyIgnore decorator to test since it is not assignable to ModelProperty",
        },
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @bodyIgnore decorator to Foo since it is not assignable to ModelProperty",
        },
      ]);
    });

    it("isBodyIgnore returns true on property decorated", async () => {
      const { body, program } = await Tester.compile(t.code`
          @post op test(@bodyIgnore ${t.modelProperty("body")}: string): string;
        `);

      ok(isBodyIgnore(program, body));
    });
  });

  describe("@statusCode", () => {
    it("emit diagnostics when @statusCode is not used on model property", async () => {
      const diagnostics = await Tester.diagnose(`
          @statusCode op test(): string;

          @statusCode model Foo {}
        `);

      expectDiagnostics(diagnostics, [
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @statusCode decorator to test since it is not assignable to ModelProperty",
        },
        {
          code: "decorator-wrong-target",
          message:
            "Cannot apply @statusCode decorator to Foo since it is not assignable to ModelProperty",
        },
      ]);
    });

    it("emits error if multiple properties are decorated with `@statusCode` in return type", async () => {
      const diagnostics = await Tester.diagnose(
        `
        model CreatedOrUpdatedResponse {
          @statusCode ok: "200";
          @statusCode created: "201";
        }
        model DateHeader {
          @header date: utcDateTime;
        }
        model Key {
          key: string;
        }
        @put op create(): CreatedOrUpdatedResponse & DateHeader & Key;
        `,
      );
      expectDiagnostics(diagnostics, [{ code: "@typespec/http/multiple-status-codes" }]);
    });

    it("emits error if multiple `@statusCode` decorators are composed together", async () => {
      const diagnostics = await Tester.diagnose(
        `      
        model CustomUnauthorizedResponse {
          @statusCode _: 401;
          @bodyRoot body: UnauthorizedResponse;
        }
  
        model Pet {
          name: string;
        }
        
        model PetList {
          @statusCode _: 200;
          @body body: Pet[];
        }
        
        op list(): PetList | CustomUnauthorizedResponse;
        `,
      );
      expectDiagnostics(diagnostics, [{ code: "@typespec/http/multiple-status-codes" }]);
    });

    it("set numeric statusCode with @statusCode", async () => {
      const { code, program } = await Tester.compile(t.code`
          op test(): {
            @statusCode ${t.modelProperty("code")}: 201
          };
        `);

      ok(isStatusCode(program, code));
      deepStrictEqual(getStatusCodes(program, code), [201]);
    });

    it("set range statusCode with @statusCode", async () => {
      const { code, program } = await Tester.compile(t.code`
          op test(): {
            @statusCode @minValue(200) @maxValue(299) ${t.modelProperty("code")}: int32;
          };
        `);

      ok(isStatusCode(program, code));
      deepStrictEqual(getStatusCodes(program, code), [{ start: 200, end: 299 }]);
    });

    describe("invalid status codes", () => {
      async function checkInvalid(code: string, message: string) {
        const diagnostics = await Tester.diagnose(`
        op test(): {
          @statusCode code: ${code}
        };
      `);

        expectDiagnostics(diagnostics, { code: "@typespec/http/status-code-invalid", message });
      }

      it("emit diagnostic if status code is not a number", () =>
        checkInvalid(`"Ok"`, "statusCode value must be a three digit code between 100 and 599"));
      it("emit diagnostic if status code is a number with more than 3 digit", () =>
        checkInvalid("12345", "statusCode value must be a three digit code between 100 and 599"));
      it("emit diagnostic if status code is not an integer", () =>
        checkInvalid("200.3", "statusCode value must be a three digit code between 100 and 599"));
    });
  });

  describe("@server", () => {
    it("emit diagnostics when @server is not used on namespace", async () => {
      const diagnostics = await Tester.diagnose(`
          @server("https://example.com", "MyServer") op test(): string;

          @server("https://example.com", "MyServer") model Foo {}
        `);

      expectDiagnostics(diagnostics, [
        {
          code: "decorator-wrong-target",
          message: "Cannot apply @server decorator to test since it is not assignable to Namespace",
        },
        {
          code: "decorator-wrong-target",
          message: "Cannot apply @server decorator to Foo since it is not assignable to Namespace",
        },
      ]);
    });

    it("emit diagnostics when url is not a string", async () => {
      const diagnostics = await Tester.diagnose(`
          @server(123, "MyServer")
          namespace MyService {}
        `);

      expectDiagnostics(diagnostics, {
        code: "invalid-argument",
      });
    });

    it("emit diagnostics when description is not a string", async () => {
      const diagnostics = await Tester.diagnose(`
        @server("https://example.com", 123)
        namespace MyService {}
      `);

      expectDiagnostics(diagnostics, {
        code: "invalid-argument",
      });
    });

    it("emit diagnostics when parameters is not a model", async () => {
      const diagnostics = await Tester.diagnose(`
        @server("https://example.com", "My service url", 123)
        namespace MyService {}
      `);

      expectDiagnostics(diagnostics, {
        code: "invalid-argument",
      });
    });

    it("emit diagnostics if url has parameters that is not specified in model", async () => {
      const diagnostics = await Tester.diagnose(`
        @server("https://example.com/{name}/foo", "My service url", {other: string})
        namespace MyService {}
      `);

      expectDiagnostics(diagnostics, {
        code: "@typespec/http/missing-server-param",
        message: "Server url contains parameter 'name' but wasn't found in given parameters",
      });
    });

    it("define a simple server without description", async () => {
      const { MyService, program } = await Tester.compile(t.code`
        @server("https://example.com")
        namespace ${t.namespace("MyService")} {}
      `);

      const servers = getServers(program, MyService);
      deepStrictEqual(servers, [
        {
          description: undefined,
          parameters: new Map(),
          url: "https://example.com",
        },
      ]);
    });

    it("define a simple server with a fixed url", async () => {
      const { MyService, program } = await Tester.compile(t.code`
        @server("https://example.com", "My service url")
        namespace ${t.namespace("MyService")} {}
      `);

      const servers = getServers(program, MyService);
      deepStrictEqual(servers, [
        {
          description: "My service url",
          parameters: new Map(),
          url: "https://example.com",
        },
      ]);
    });

    it("define a server with parameters", async () => {
      const { MyService, NameParam, program } = await Tester.compile(t.code`
        @server("https://example.com/{name}/foo", "My service url", {@test("NameParam") name: string })
        namespace ${t.namespace("MyService")} {}
      `);

      const servers = getServers(program, MyService);
      deepStrictEqual(servers, [
        {
          description: "My service url",
          parameters: new Map<string, ModelProperty>([["name", NameParam as any]]),
          url: "https://example.com/{name}/foo",
        },
      ]);
    });
  });

  describe("@useAuth", () => {
    it("emit diagnostics when config is not a model, tuple or union", async () => {
      const diagnostics = await Tester.diagnose(`
          @useAuth(anOp)
          namespace Foo {}

          op anOp(): void;
        `);

      expectDiagnostics(diagnostics, {
        code: "invalid-argument",
      });
    });

    it("emit diagnostic when OAuth2 flow is not a valid model", async () => {
      const diagnostics = await Tester.diagnose(`
        @useAuth(OAuth2Auth<["foo"]>)
        namespace Foo {}

        model Flow { noscopes: "boom"; };
        @useAuth(OAuth2Auth<[Flow]>)
        namespace Bar {}
        `);

      expectDiagnostics(diagnostics, [
        {
          code: "invalid-argument",
        },
        {
          code: "invalid-argument",
        },
      ]);
    });

    it("can specify BasicAuth", async () => {
      const { Foo, program } = await Tester.compile(t.code`
        @useAuth(BasicAuth)
        namespace ${t.namespace("Foo")} {}
      `);

      expect(getAuthentication(program, Foo)).toEqual({
        options: [
          {
            schemes: [
              {
                id: "BasicAuth",
                type: "http",
                scheme: "Basic",
                model: expect.objectContaining({ kind: "Model" }),
              },
            ],
          },
        ],
      });
    });

    it("can specify custom auth name with description", async () => {
      const { Foo, program } = await Tester.compile(t.code`
        @doc("My custom basic auth")
        model MyAuth is BasicAuth;
        @useAuth(MyAuth)
        namespace ${t.namespace("Foo")} {}
      `);

      expect(getAuthentication(program, Foo)).toEqual({
        options: [
          {
            schemes: [
              {
                id: "MyAuth",
                description: "My custom basic auth",
                type: "http",
                scheme: "Basic",
                model: expect.objectContaining({ kind: "Model" }),
              },
            ],
          },
        ],
      });
    });

    it("can specify BearerAuth", async () => {
      const { Foo, program } = await Tester.compile(t.code`
        @useAuth(BearerAuth)
        namespace ${t.namespace("Foo")} {}
      `);

      expect(getAuthentication(program, Foo)).toEqual({
        options: [
          {
            schemes: [
              {
                id: "BearerAuth",
                type: "http",
                scheme: "Bearer",
                model: expect.objectContaining({ kind: "Model" }),
              },
            ],
          },
        ],
      });
    });

    it("can specify ApiKeyAuth", async () => {
      const { Foo, program } = await Tester.compile(t.code`
        @useAuth(ApiKeyAuth<ApiKeyLocation.header, "x-my-header">)
        namespace ${t.namespace("Foo")} {}
      `);

      expect(getAuthentication(program, Foo)).toEqual({
        options: [
          {
            schemes: [
              {
                id: "ApiKeyAuth",
                type: "apiKey",
                in: "header",
                name: "x-my-header",
                model: expect.objectContaining({ kind: "Model" }),
              },
            ],
          },
        ],
      });
    });

    it("can specify OAuth2", async () => {
      const { Foo, program } = await Tester.compile(t.code`
        model MyFlow {
          type: OAuth2FlowType.implicit;
          authorizationUrl: "https://api.example.com/oauth2/authorize";
          refreshUrl: "https://api.example.com/oauth2/refresh";
          scopes: ["read", "write"];
        }
        @useAuth(OAuth2Auth<[MyFlow]>)
        namespace ${t.namespace("Foo")} {}
      `);

      expect(getAuthentication(program, Foo)).toEqual({
        options: [
          {
            schemes: [
              {
                id: "OAuth2Auth",
                type: "oauth2",
                flows: [
                  {
                    type: "implicit",
                    authorizationUrl: "https://api.example.com/oauth2/authorize",
                    refreshUrl: "https://api.example.com/oauth2/refresh",
                    scopes: [{ value: "read" }, { value: "write" }],
                  },
                ],
                model: expect.objectContaining({ kind: "Model" }),
              },
            ],
          },
        ],
      });
    });

    it("can specify OAuth2 with scopes, which are default for every flow", async () => {
      const { Foo, program } = await Tester.compile(t.code`
        alias MyAuth<T extends string[]> = OAuth2Auth<Flows=[{
          type: OAuth2FlowType.implicit;
          authorizationUrl: "https://api.example.com/oauth2/authorize";
          refreshUrl: "https://api.example.com/oauth2/refresh";
        }], Scopes=T>;

        @useAuth(MyAuth<["read", "write"]>)
        namespace ${t.namespace("Foo")} {}
      `);

      expect(getAuthentication(program, Foo)).toEqual({
        options: [
          {
            schemes: [
              {
                id: "OAuth2Auth",
                type: "oauth2",
                flows: [
                  {
                    type: "implicit",
                    authorizationUrl: "https://api.example.com/oauth2/authorize",
                    refreshUrl: "https://api.example.com/oauth2/refresh",
                    scopes: [{ value: "read" }, { value: "write" }],
                  },
                ],
                model: expect.objectContaining({ kind: "Model" }),
              },
            ],
          },
        ],
      });
    });

    it("can specify NoAuth", async () => {
      const { Foo, program } = await Tester.compile(t.code`
        @useAuth(NoAuth)
        namespace ${t.namespace("Foo")} {}
      `);

      expect(getAuthentication(program, Foo)).toEqual({
        options: [
          {
            schemes: [
              {
                id: "NoAuth",
                type: "noAuth",
                model: expect.objectContaining({ kind: "Model" }),
              },
            ],
          },
        ],
      });
    });

    it("can specify multiple auth options", async () => {
      const { Foo, program } = await Tester.compile(t.code`
        @useAuth(BasicAuth | BearerAuth)
        namespace ${t.namespace("Foo")} {}
      `);

      expect(getAuthentication(program, Foo)).toEqual({
        options: [
          {
            schemes: [
              {
                id: "BasicAuth",
                type: "http",
                scheme: "Basic",
                model: expect.objectContaining({ kind: "Model" }),
              },
            ],
          },
          {
            schemes: [
              {
                id: "BearerAuth",
                type: "http",
                scheme: "Bearer",
                model: expect.objectContaining({ kind: "Model" }),
              },
            ],
          },
        ],
      });
    });

    it("can specify multiple auth schemes to be used together", async () => {
      const { Foo, program } = await Tester.compile(t.code`
        @useAuth([BasicAuth, BearerAuth])
        namespace ${t.namespace("Foo")} {}
      `);

      expect(getAuthentication(program, Foo)).toEqual({
        options: [
          {
            schemes: [
              {
                id: "BasicAuth",
                type: "http",
                scheme: "Basic",
                model: expect.objectContaining({ kind: "Model" }),
              },
              {
                id: "BearerAuth",
                type: "http",
                scheme: "Bearer",
                model: expect.objectContaining({ kind: "Model" }),
              },
            ],
          },
        ],
      });
    });

    it("can specify multiple auth schemes to be used together and multiple options", async () => {
      const { Foo, program } = await Tester.compile(t.code`
        @useAuth(BearerAuth | [ApiKeyAuth<ApiKeyLocation.header, "x-my-header">, BasicAuth])
        namespace ${t.namespace("Foo")} {}
      `);

      expect(getAuthentication(program, Foo)).toEqual({
        options: [
          {
            schemes: [
              {
                id: "BearerAuth",
                type: "http",
                scheme: "Bearer",
                model: expect.objectContaining({ kind: "Model" }),
              },
            ],
          },
          {
            schemes: [
              {
                id: "ApiKeyAuth",
                type: "apiKey",
                in: "header",
                name: "x-my-header",
                model: expect.objectContaining({ kind: "Model" }),
              },
              {
                id: "BasicAuth",
                type: "http",
                scheme: "Basic",
                model: expect.objectContaining({ kind: "Model" }),
              },
            ],
          },
        ],
      });
    });

    it("can override auth schemes on interface", async () => {
      const { Foo, program } = await Tester.compile(t.code`
        alias ServiceKeyAuth = ApiKeyAuth<ApiKeyLocation.header, "X-API-KEY">;
        @useAuth(ServiceKeyAuth)
        namespace ${t.namespace("Foo")} {
          @useAuth(BasicAuth | BearerAuth)
          interface Bar { }
        }
      `);

      expect(getAuthentication(program, Foo.interfaces.get("Bar")!)).toEqual({
        options: [
          {
            schemes: [
              {
                id: "BasicAuth",
                type: "http",
                scheme: "Basic",
                model: expect.objectContaining({ kind: "Model" }),
              },
            ],
          },
          {
            schemes: [
              {
                id: "BearerAuth",
                type: "http",
                scheme: "Bearer",
                model: expect.objectContaining({ kind: "Model" }),
              },
            ],
          },
        ],
      });
    });

    it("can override auth schemes on operation", async () => {
      const { Foo, program } = await Tester.compile(t.code`
        alias ServiceKeyAuth = ApiKeyAuth<ApiKeyLocation.header, "X-API-KEY">;
        @useAuth(ServiceKeyAuth)
        namespace ${t.namespace("Foo")} {
          @useAuth([BasicAuth, BearerAuth])
          op bar(): void;
        }
      `);

      expect(getAuthentication(program, Foo.operations.get("bar")!)).toEqual({
        options: [
          {
            schemes: [
              {
                id: "BasicAuth",
                type: "http",
                scheme: "Basic",
                model: expect.objectContaining({ kind: "Model" }),
              },
              {
                id: "BearerAuth",
                type: "http",
                scheme: "Bearer",
                model: expect.objectContaining({ kind: "Model" }),
              },
            ],
          },
        ],
      });
    });
  });

  describe("@includeInapplicableMetadataInPayload", () => {
    it("defaults to true", async () => {
      const { M, program } = await Tester.compile(t.code`
        namespace Foo;
        model ${t.model("M")} {p: string; }
      `);

      strictEqual(M.kind, "Model" as const);
      strictEqual(includeInapplicableMetadataInPayload(program, M.properties.get("p")!), true);
    });
    it("can specify at namespace level", async () => {
      const { M, program } = await Tester.compile(t.code`
        @Private.includeInapplicableMetadataInPayload(false)
        namespace Foo;
        model ${t.model("M")} {p: string; }
      `);

      strictEqual(M.kind, "Model" as const);
      strictEqual(includeInapplicableMetadataInPayload(program, M.properties.get("p")!), false);
    });
    it("can specify at model level", async () => {
      const { M, program } = await Tester.compile(t.code`
      namespace Foo;
      @Private.includeInapplicableMetadataInPayload(false) model ${t.model("M")} { p: string; }
    `);

      strictEqual(M.kind, "Model" as const);
      strictEqual(includeInapplicableMetadataInPayload(program, M.properties.get("p")!), false);
    });
    it("can specify at property level", async () => {
      const { M, program } = await Tester.compile(t.code`
      namespace Foo;
      model ${t.model("M")} { @Private.includeInapplicableMetadataInPayload(false) p: string; }
    `);

      strictEqual(M.kind, "Model" as const);
      strictEqual(includeInapplicableMetadataInPayload(program, M.properties.get("p")!), false);
    });

    it("can be overridden", async () => {
      const { M, program } = await Tester.compile(t.code`
      @Private.includeInapplicableMetadataInPayload(false)
      namespace Foo;
      @Private.includeInapplicableMetadataInPayload(true) model ${t.model("M")} { p: string; }
    `);

      strictEqual(M.kind, "Model" as const);
      strictEqual(includeInapplicableMetadataInPayload(program, M.properties.get("p")!), true);
    });
  });
});
