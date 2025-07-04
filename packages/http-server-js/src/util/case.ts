// Copyright (c) Microsoft Corporation
// Licensed under the MIT license.

import { KEYWORDS } from "./keywords.js";

/**
 * Separators recognized by the case parser.
 */
const SEPARATORS = /[\s:_\-./\\]/;

/**
 * Separators that are considered unspeakable.
 */
const UNSPEAKABLE_SEPARATORS = /[\s:\-./\\]/;

/**
 * Returns true if a name cannot be spoken. A name is unspeakable if:
 *
 * - It contains only separators and whitespace.
 *
 * OR
 *
 * - The first non-separator, non-whitespace character is a digit.
 *
 * @param name - a name in any case
 * @returns true if the name is unspeakable
 */
export function isUnspeakable(name: string): boolean {
  for (const c of name) {
    if (!UNSPEAKABLE_SEPARATORS.test(c)) {
      return /[0-9]/.test(c);
    }
  }

  return true;
}

const JS_IDENTIFIER = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

/**
 * Returns the property name to be used in an object literal.
 */
export function objectLiteralProperty(name: string): string {
  if (!JS_IDENTIFIER.test(name) || KEYWORDS.has(name)) {
    return JSON.stringify(name);
  } else {
    return name;
  }
}

/**
 * Returns an access expression for a given subject and key.
 *
 * If the access can be performed using dot notation, it will. Otherwise, bracket notation will be used.
 *
 * @param subject - the expression to access
 * @param key - the key to access within the subject, must be an index value literal, not an expression
 */
export function access(subject: string, key: string | number): string {
  subject = JS_IDENTIFIER.test(subject) ? subject : `(${subject})`;
  if (typeof key === "string" && JS_IDENTIFIER.test(key)) {
    return `${subject}.${key}`;
  } else {
    return `${subject}[${JSON.stringify(key)}]`;
  }
}

/**
 * Destructures a name into its components.
 *
 * The following case conventions are supported:
 * - PascalCase (["pascal", "case"])
 * - camelCase (["camel", "case"])
 * - snake_case (["snake", "case"])
 * - kebab-case (["kebab", "case"])
 * - dot.separated (["dot", "separated"])
 * - path/separated (["path", "separated"])
 * - double::colon::separated (["double", "colon", "separated"])
 * - space separated (["space", "separated"])
 *
 * - AND any combination of the above, or any other separators or combination of separators.
 *
 * @param name - a name in any case
 */
export function parseCase(name: string): ReCase {
  const components: string[] = [];

  let currentComponent = "";
  let inAcronym = false;
  let inLeadingUnderscore = false;

  for (let i = 0; i < name.length; i++) {
    const char = name[i];

    // cSpell:ignore presponse
    // Special case acronym handling. We want to treat acronyms as a single component,
    // but we also want the last capitalized letter in an all caps sequence to start a new
    // component if the next letter is lower case.
    // For example : "HTTPResponse" => ["http", "response"]
    //             : "OpenAIContext" => ["open", "ai", "context"]
    //  but        : "HTTPresponse" (wrong) => ["htt", "presponse"]
    //  however    : "HTTP_response" (okay I guess) => ["http", "response"]

    // allow leading underscores to be part of the first component
    if (!components.length && char === "_") {
      inLeadingUnderscore = true;
      currentComponent += char;
      continue;
    } else if (inLeadingUnderscore && char !== "_") {
      inLeadingUnderscore = false;
      components.push(currentComponent);
      currentComponent = "";
    }

    // If the character is a separator or an upper case character, we push the current component and start a new one.
    if (char === char.toUpperCase() && !/[0-9]/.test(char)) {
      // If we're in an acronym, we need to check if the next character is lower case.
      // If it is, then this is the start of a new component.
      const acronymRestart =
        inAcronym && /[A-Z]/.test(char) && i + 1 < name.length && /[a-z]/.test(name[i + 1]);

      if (currentComponent.length > 0 && (acronymRestart || !inAcronym)) {
        components.push(currentComponent.trim());
        currentComponent = "";
      }
    }

    if (!SEPARATORS.test(char)) {
      currentComponent += char.toLowerCase();
    }

    inAcronym = /[A-Z]/.test(char);
  }

  if (currentComponent.length > 0) {
    components.push(currentComponent);
  }

  return recase(components);
}

/**
 * An object allowing a name to be converted into various case conventions.
 */
export interface ReCase extends ReCaseUpper {
  /**
   * The components of the name with the first letter of each component capitalized and joined by an empty string.
   */
  readonly pascalCase: string;
  /**
   * The components of the name with the first letter of the second and all subsequent components capitalized and joined
   * by an empty string.
   */
  readonly camelCase: string;

  /**
   * Convert the components of the name into all uppercase letters.
   */
  readonly upper: ReCaseUpper;
}

interface ReCaseUpper {
  /**
   * The components of the name.
   */
  readonly components: readonly string[];

  /**
   * The components of the name joined by underscores.
   */
  readonly snakeCase: string;
  /**
   * The components of the name joined by hyphens.
   */
  readonly kebabCase: string;
  /**
   * The components of the name joined by periods.
   */
  readonly dotCase: string;
  /**
   * The components of the name joined by slashes.
   *
   * This uses forward slashes in the unix convention.
   */
  readonly pathCase: string;

  /**
   * Join the components with any given string.
   *
   * @param separator - the separator to join the components with
   */
  join(separator: string): string;
}

function recase(components: readonly string[]): ReCase {
  const hasLeadingUnderscores = components.length > 0 && components[0].startsWith("_");
  function joinComponents(joiner: string): string {
    if (hasLeadingUnderscores) {
      // The first component contains the leading underscores, so no need to add one.
      return `${components[0]}${components.slice(1).join(joiner)}`;
    }
    return components.join(joiner);
  }
  return Object.freeze({
    components,
    get pascalCase() {
      return components
        .map((component) => component[0].toUpperCase() + component.slice(1))
        .join("");
    },
    get camelCase() {
      return components
        .map((component, index) =>
          index === 0 || (hasLeadingUnderscores && index === 1)
            ? component
            : component[0].toUpperCase() + component.slice(1),
        )
        .join("");
    },
    get snakeCase() {
      return joinComponents("_");
    },
    get kebabCase() {
      return joinComponents("-");
    },
    get dotCase() {
      return joinComponents(".");
    },
    get pathCase() {
      return joinComponents("/");
    },

    get upper() {
      return recase(components.map((component) => component.toUpperCase()));
    },

    join(separator: string) {
      return joinComponents(separator);
    },
  });
}
