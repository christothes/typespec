// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Code generated by Microsoft (R) TypeSpec Code Generator.

package azure.resourcemanager.operationtemplates.implementation;

import azure.resourcemanager.operationtemplates.fluent.OptionalBodiesClient;
import azure.resourcemanager.operationtemplates.fluent.models.ActionResultInner;
import azure.resourcemanager.operationtemplates.fluent.models.ChangeAllowanceResultInner;
import azure.resourcemanager.operationtemplates.fluent.models.WidgetInner;
import azure.resourcemanager.operationtemplates.models.ActionRequest;
import azure.resourcemanager.operationtemplates.models.ChangeAllowanceRequest;
import com.azure.core.annotation.BodyParam;
import com.azure.core.annotation.ExpectedResponses;
import com.azure.core.annotation.Get;
import com.azure.core.annotation.HeaderParam;
import com.azure.core.annotation.Headers;
import com.azure.core.annotation.Host;
import com.azure.core.annotation.HostParam;
import com.azure.core.annotation.Patch;
import com.azure.core.annotation.PathParam;
import com.azure.core.annotation.Post;
import com.azure.core.annotation.QueryParam;
import com.azure.core.annotation.ReturnType;
import com.azure.core.annotation.ServiceInterface;
import com.azure.core.annotation.ServiceMethod;
import com.azure.core.annotation.UnexpectedResponseExceptionType;
import com.azure.core.http.rest.Response;
import com.azure.core.http.rest.RestProxy;
import com.azure.core.management.exception.ManagementException;
import com.azure.core.util.Context;
import com.azure.core.util.FluxUtil;
import com.azure.core.util.logging.ClientLogger;
import reactor.core.publisher.Mono;

/**
 * An instance of this class provides access to all the operations defined in OptionalBodiesClient.
 */
public final class OptionalBodiesClientImpl implements OptionalBodiesClient {
    /**
     * The proxy service used to perform REST calls.
     */
    private final OptionalBodiesService service;

    /**
     * The service client containing this operation class.
     */
    private final OperationTemplatesClientImpl client;

    /**
     * Initializes an instance of OptionalBodiesClientImpl.
     * 
     * @param client the instance of the service client containing this operation class.
     */
    OptionalBodiesClientImpl(OperationTemplatesClientImpl client) {
        this.service
            = RestProxy.create(OptionalBodiesService.class, client.getHttpPipeline(), client.getSerializerAdapter());
        this.client = client;
    }

    /**
     * The interface defining all the services for OperationTemplatesClientOptionalBodies to be used by the proxy
     * service to perform REST calls.
     */
    @Host("{endpoint}")
    @ServiceInterface(name = "OperationTemplatesClientOptionalBodies")
    public interface OptionalBodiesService {
        @Headers({ "Content-Type: application/json" })
        @Get("/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Azure.ResourceManager.OperationTemplates/widgets/{widgetName}")
        @ExpectedResponses({ 200 })
        @UnexpectedResponseExceptionType(ManagementException.class)
        Mono<Response<WidgetInner>> getByResourceGroup(@HostParam("endpoint") String endpoint,
            @QueryParam("api-version") String apiVersion, @PathParam("subscriptionId") String subscriptionId,
            @PathParam("resourceGroupName") String resourceGroupName, @PathParam("widgetName") String widgetName,
            @HeaderParam("Accept") String accept, Context context);

        @Headers({ "Content-Type: application/json" })
        @Get("/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Azure.ResourceManager.OperationTemplates/widgets/{widgetName}")
        @ExpectedResponses({ 200 })
        @UnexpectedResponseExceptionType(ManagementException.class)
        Response<WidgetInner> getByResourceGroupSync(@HostParam("endpoint") String endpoint,
            @QueryParam("api-version") String apiVersion, @PathParam("subscriptionId") String subscriptionId,
            @PathParam("resourceGroupName") String resourceGroupName, @PathParam("widgetName") String widgetName,
            @HeaderParam("Accept") String accept, Context context);

        @Headers({ "Content-Type: application/json" })
        @Patch("/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Azure.ResourceManager.OperationTemplates/widgets/{widgetName}")
        @ExpectedResponses({ 200 })
        @UnexpectedResponseExceptionType(ManagementException.class)
        Mono<Response<WidgetInner>> patch(@HostParam("endpoint") String endpoint,
            @QueryParam("api-version") String apiVersion, @PathParam("subscriptionId") String subscriptionId,
            @PathParam("resourceGroupName") String resourceGroupName, @PathParam("widgetName") String widgetName,
            @HeaderParam("Accept") String accept, @BodyParam("application/json") WidgetInner properties,
            Context context);

        @Headers({ "Content-Type: application/json" })
        @Patch("/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Azure.ResourceManager.OperationTemplates/widgets/{widgetName}")
        @ExpectedResponses({ 200 })
        @UnexpectedResponseExceptionType(ManagementException.class)
        Response<WidgetInner> patchSync(@HostParam("endpoint") String endpoint,
            @QueryParam("api-version") String apiVersion, @PathParam("subscriptionId") String subscriptionId,
            @PathParam("resourceGroupName") String resourceGroupName, @PathParam("widgetName") String widgetName,
            @HeaderParam("Accept") String accept, @BodyParam("application/json") WidgetInner properties,
            Context context);

        @Headers({ "Content-Type: application/json" })
        @Post("/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Azure.ResourceManager.OperationTemplates/widgets/{widgetName}/post")
        @ExpectedResponses({ 200 })
        @UnexpectedResponseExceptionType(ManagementException.class)
        Mono<Response<ActionResultInner>> post(@HostParam("endpoint") String endpoint,
            @QueryParam("api-version") String apiVersion, @PathParam("subscriptionId") String subscriptionId,
            @PathParam("resourceGroupName") String resourceGroupName, @PathParam("widgetName") String widgetName,
            @HeaderParam("Accept") String accept, @BodyParam("application/json") ActionRequest body, Context context);

        @Headers({ "Content-Type: application/json" })
        @Post("/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Azure.ResourceManager.OperationTemplates/widgets/{widgetName}/post")
        @ExpectedResponses({ 200 })
        @UnexpectedResponseExceptionType(ManagementException.class)
        Response<ActionResultInner> postSync(@HostParam("endpoint") String endpoint,
            @QueryParam("api-version") String apiVersion, @PathParam("subscriptionId") String subscriptionId,
            @PathParam("resourceGroupName") String resourceGroupName, @PathParam("widgetName") String widgetName,
            @HeaderParam("Accept") String accept, @BodyParam("application/json") ActionRequest body, Context context);

        @Headers({ "Content-Type: application/json" })
        @Post("/subscriptions/{subscriptionId}/providers/Azure.ResourceManager.OperationTemplates/providerPost")
        @ExpectedResponses({ 200 })
        @UnexpectedResponseExceptionType(ManagementException.class)
        Mono<Response<ChangeAllowanceResultInner>> providerPost(@HostParam("endpoint") String endpoint,
            @QueryParam("api-version") String apiVersion, @PathParam("subscriptionId") String subscriptionId,
            @HeaderParam("Accept") String accept, @BodyParam("application/json") ChangeAllowanceRequest body,
            Context context);

        @Headers({ "Content-Type: application/json" })
        @Post("/subscriptions/{subscriptionId}/providers/Azure.ResourceManager.OperationTemplates/providerPost")
        @ExpectedResponses({ 200 })
        @UnexpectedResponseExceptionType(ManagementException.class)
        Response<ChangeAllowanceResultInner> providerPostSync(@HostParam("endpoint") String endpoint,
            @QueryParam("api-version") String apiVersion, @PathParam("subscriptionId") String subscriptionId,
            @HeaderParam("Accept") String accept, @BodyParam("application/json") ChangeAllowanceRequest body,
            Context context);
    }

    /**
     * Get a Widget.
     * 
     * @param resourceGroupName The name of the resource group. The name is case insensitive.
     * @param widgetName The name of the Widget.
     * @throws IllegalArgumentException thrown if parameters fail the validation.
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return a Widget along with {@link Response} on successful completion of {@link Mono}.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    private Mono<Response<WidgetInner>> getByResourceGroupWithResponseAsync(String resourceGroupName,
        String widgetName) {
        if (this.client.getEndpoint() == null) {
            return Mono.error(
                new IllegalArgumentException("Parameter this.client.getEndpoint() is required and cannot be null."));
        }
        if (this.client.getSubscriptionId() == null) {
            return Mono.error(new IllegalArgumentException(
                "Parameter this.client.getSubscriptionId() is required and cannot be null."));
        }
        if (resourceGroupName == null) {
            return Mono
                .error(new IllegalArgumentException("Parameter resourceGroupName is required and cannot be null."));
        }
        if (widgetName == null) {
            return Mono.error(new IllegalArgumentException("Parameter widgetName is required and cannot be null."));
        }
        final String accept = "application/json";
        return FluxUtil
            .withContext(context -> service.getByResourceGroup(this.client.getEndpoint(), this.client.getApiVersion(),
                this.client.getSubscriptionId(), resourceGroupName, widgetName, accept, context))
            .contextWrite(context -> context.putAll(FluxUtil.toReactorContext(this.client.getContext()).readOnly()));
    }

    /**
     * Get a Widget.
     * 
     * @param resourceGroupName The name of the resource group. The name is case insensitive.
     * @param widgetName The name of the Widget.
     * @throws IllegalArgumentException thrown if parameters fail the validation.
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return a Widget on successful completion of {@link Mono}.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    private Mono<WidgetInner> getByResourceGroupAsync(String resourceGroupName, String widgetName) {
        return getByResourceGroupWithResponseAsync(resourceGroupName, widgetName)
            .flatMap(res -> Mono.justOrEmpty(res.getValue()));
    }

    /**
     * Get a Widget.
     * 
     * @param resourceGroupName The name of the resource group. The name is case insensitive.
     * @param widgetName The name of the Widget.
     * @param context The context to associate with this operation.
     * @throws IllegalArgumentException thrown if parameters fail the validation.
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return a Widget along with {@link Response}.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    public Response<WidgetInner> getByResourceGroupWithResponse(String resourceGroupName, String widgetName,
        Context context) {
        if (this.client.getEndpoint() == null) {
            throw LOGGER.atError()
                .log(new IllegalArgumentException(
                    "Parameter this.client.getEndpoint() is required and cannot be null."));
        }
        if (this.client.getSubscriptionId() == null) {
            throw LOGGER.atError()
                .log(new IllegalArgumentException(
                    "Parameter this.client.getSubscriptionId() is required and cannot be null."));
        }
        if (resourceGroupName == null) {
            throw LOGGER.atError()
                .log(new IllegalArgumentException("Parameter resourceGroupName is required and cannot be null."));
        }
        if (widgetName == null) {
            throw LOGGER.atError()
                .log(new IllegalArgumentException("Parameter widgetName is required and cannot be null."));
        }
        final String accept = "application/json";
        return service.getByResourceGroupSync(this.client.getEndpoint(), this.client.getApiVersion(),
            this.client.getSubscriptionId(), resourceGroupName, widgetName, accept, context);
    }

    /**
     * Get a Widget.
     * 
     * @param resourceGroupName The name of the resource group. The name is case insensitive.
     * @param widgetName The name of the Widget.
     * @throws IllegalArgumentException thrown if parameters fail the validation.
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return a Widget.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    public WidgetInner getByResourceGroup(String resourceGroupName, String widgetName) {
        return getByResourceGroupWithResponse(resourceGroupName, widgetName, Context.NONE).getValue();
    }

    /**
     * Update a Widget.
     * 
     * @param resourceGroupName The name of the resource group. The name is case insensitive.
     * @param widgetName The name of the Widget.
     * @param properties The resource properties to be updated.
     * @throws IllegalArgumentException thrown if parameters fail the validation.
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return concrete tracked resource types can be created by aliasing this type using a specific property type along
     * with {@link Response} on successful completion of {@link Mono}.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    private Mono<Response<WidgetInner>> patchWithResponseAsync(String resourceGroupName, String widgetName,
        WidgetInner properties) {
        if (this.client.getEndpoint() == null) {
            return Mono.error(
                new IllegalArgumentException("Parameter this.client.getEndpoint() is required and cannot be null."));
        }
        if (this.client.getSubscriptionId() == null) {
            return Mono.error(new IllegalArgumentException(
                "Parameter this.client.getSubscriptionId() is required and cannot be null."));
        }
        if (resourceGroupName == null) {
            return Mono
                .error(new IllegalArgumentException("Parameter resourceGroupName is required and cannot be null."));
        }
        if (widgetName == null) {
            return Mono.error(new IllegalArgumentException("Parameter widgetName is required and cannot be null."));
        }
        if (properties != null) {
            properties.validate();
        }
        final String accept = "application/json";
        return FluxUtil
            .withContext(context -> service.patch(this.client.getEndpoint(), this.client.getApiVersion(),
                this.client.getSubscriptionId(), resourceGroupName, widgetName, accept, properties, context))
            .contextWrite(context -> context.putAll(FluxUtil.toReactorContext(this.client.getContext()).readOnly()));
    }

    /**
     * Update a Widget.
     * 
     * @param resourceGroupName The name of the resource group. The name is case insensitive.
     * @param widgetName The name of the Widget.
     * @throws IllegalArgumentException thrown if parameters fail the validation.
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return concrete tracked resource types can be created by aliasing this type using a specific property type on
     * successful completion of {@link Mono}.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    private Mono<WidgetInner> patchAsync(String resourceGroupName, String widgetName) {
        final WidgetInner properties = null;
        return patchWithResponseAsync(resourceGroupName, widgetName, properties)
            .flatMap(res -> Mono.justOrEmpty(res.getValue()));
    }

    /**
     * Update a Widget.
     * 
     * @param resourceGroupName The name of the resource group. The name is case insensitive.
     * @param widgetName The name of the Widget.
     * @param properties The resource properties to be updated.
     * @param context The context to associate with this operation.
     * @throws IllegalArgumentException thrown if parameters fail the validation.
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return concrete tracked resource types can be created by aliasing this type using a specific property type along
     * with {@link Response}.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    public Response<WidgetInner> patchWithResponse(String resourceGroupName, String widgetName, WidgetInner properties,
        Context context) {
        if (this.client.getEndpoint() == null) {
            throw LOGGER.atError()
                .log(new IllegalArgumentException(
                    "Parameter this.client.getEndpoint() is required and cannot be null."));
        }
        if (this.client.getSubscriptionId() == null) {
            throw LOGGER.atError()
                .log(new IllegalArgumentException(
                    "Parameter this.client.getSubscriptionId() is required and cannot be null."));
        }
        if (resourceGroupName == null) {
            throw LOGGER.atError()
                .log(new IllegalArgumentException("Parameter resourceGroupName is required and cannot be null."));
        }
        if (widgetName == null) {
            throw LOGGER.atError()
                .log(new IllegalArgumentException("Parameter widgetName is required and cannot be null."));
        }
        if (properties != null) {
            properties.validate();
        }
        final String accept = "application/json";
        return service.patchSync(this.client.getEndpoint(), this.client.getApiVersion(),
            this.client.getSubscriptionId(), resourceGroupName, widgetName, accept, properties, context);
    }

    /**
     * Update a Widget.
     * 
     * @param resourceGroupName The name of the resource group. The name is case insensitive.
     * @param widgetName The name of the Widget.
     * @throws IllegalArgumentException thrown if parameters fail the validation.
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return concrete tracked resource types can be created by aliasing this type using a specific property type.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    public WidgetInner patch(String resourceGroupName, String widgetName) {
        final WidgetInner properties = null;
        return patchWithResponse(resourceGroupName, widgetName, properties, Context.NONE).getValue();
    }

    /**
     * A synchronous resource action.
     * 
     * @param resourceGroupName The name of the resource group. The name is case insensitive.
     * @param widgetName The name of the Widget.
     * @param body The content of the action request.
     * @throws IllegalArgumentException thrown if parameters fail the validation.
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return the response body along with {@link Response} on successful completion of {@link Mono}.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    private Mono<Response<ActionResultInner>> postWithResponseAsync(String resourceGroupName, String widgetName,
        ActionRequest body) {
        if (this.client.getEndpoint() == null) {
            return Mono.error(
                new IllegalArgumentException("Parameter this.client.getEndpoint() is required and cannot be null."));
        }
        if (this.client.getSubscriptionId() == null) {
            return Mono.error(new IllegalArgumentException(
                "Parameter this.client.getSubscriptionId() is required and cannot be null."));
        }
        if (resourceGroupName == null) {
            return Mono
                .error(new IllegalArgumentException("Parameter resourceGroupName is required and cannot be null."));
        }
        if (widgetName == null) {
            return Mono.error(new IllegalArgumentException("Parameter widgetName is required and cannot be null."));
        }
        if (body != null) {
            body.validate();
        }
        final String accept = "application/json";
        return FluxUtil
            .withContext(context -> service.post(this.client.getEndpoint(), this.client.getApiVersion(),
                this.client.getSubscriptionId(), resourceGroupName, widgetName, accept, body, context))
            .contextWrite(context -> context.putAll(FluxUtil.toReactorContext(this.client.getContext()).readOnly()));
    }

    /**
     * A synchronous resource action.
     * 
     * @param resourceGroupName The name of the resource group. The name is case insensitive.
     * @param widgetName The name of the Widget.
     * @throws IllegalArgumentException thrown if parameters fail the validation.
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return the response body on successful completion of {@link Mono}.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    private Mono<ActionResultInner> postAsync(String resourceGroupName, String widgetName) {
        final ActionRequest body = null;
        return postWithResponseAsync(resourceGroupName, widgetName, body)
            .flatMap(res -> Mono.justOrEmpty(res.getValue()));
    }

    /**
     * A synchronous resource action.
     * 
     * @param resourceGroupName The name of the resource group. The name is case insensitive.
     * @param widgetName The name of the Widget.
     * @param body The content of the action request.
     * @param context The context to associate with this operation.
     * @throws IllegalArgumentException thrown if parameters fail the validation.
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return the response body along with {@link Response}.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    public Response<ActionResultInner> postWithResponse(String resourceGroupName, String widgetName, ActionRequest body,
        Context context) {
        if (this.client.getEndpoint() == null) {
            throw LOGGER.atError()
                .log(new IllegalArgumentException(
                    "Parameter this.client.getEndpoint() is required and cannot be null."));
        }
        if (this.client.getSubscriptionId() == null) {
            throw LOGGER.atError()
                .log(new IllegalArgumentException(
                    "Parameter this.client.getSubscriptionId() is required and cannot be null."));
        }
        if (resourceGroupName == null) {
            throw LOGGER.atError()
                .log(new IllegalArgumentException("Parameter resourceGroupName is required and cannot be null."));
        }
        if (widgetName == null) {
            throw LOGGER.atError()
                .log(new IllegalArgumentException("Parameter widgetName is required and cannot be null."));
        }
        if (body != null) {
            body.validate();
        }
        final String accept = "application/json";
        return service.postSync(this.client.getEndpoint(), this.client.getApiVersion(), this.client.getSubscriptionId(),
            resourceGroupName, widgetName, accept, body, context);
    }

    /**
     * A synchronous resource action.
     * 
     * @param resourceGroupName The name of the resource group. The name is case insensitive.
     * @param widgetName The name of the Widget.
     * @throws IllegalArgumentException thrown if parameters fail the validation.
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return the response.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    public ActionResultInner post(String resourceGroupName, String widgetName) {
        final ActionRequest body = null;
        return postWithResponse(resourceGroupName, widgetName, body, Context.NONE).getValue();
    }

    /**
     * The providerPost operation.
     * 
     * @param body The request body.
     * @throws IllegalArgumentException thrown if parameters fail the validation.
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return the response body along with {@link Response} on successful completion of {@link Mono}.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    private Mono<Response<ChangeAllowanceResultInner>> providerPostWithResponseAsync(ChangeAllowanceRequest body) {
        if (this.client.getEndpoint() == null) {
            return Mono.error(
                new IllegalArgumentException("Parameter this.client.getEndpoint() is required and cannot be null."));
        }
        if (this.client.getSubscriptionId() == null) {
            return Mono.error(new IllegalArgumentException(
                "Parameter this.client.getSubscriptionId() is required and cannot be null."));
        }
        if (body != null) {
            body.validate();
        }
        final String accept = "application/json";
        return FluxUtil
            .withContext(context -> service.providerPost(this.client.getEndpoint(), this.client.getApiVersion(),
                this.client.getSubscriptionId(), accept, body, context))
            .contextWrite(context -> context.putAll(FluxUtil.toReactorContext(this.client.getContext()).readOnly()));
    }

    /**
     * The providerPost operation.
     * 
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return the response body on successful completion of {@link Mono}.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    private Mono<ChangeAllowanceResultInner> providerPostAsync() {
        final ChangeAllowanceRequest body = null;
        return providerPostWithResponseAsync(body).flatMap(res -> Mono.justOrEmpty(res.getValue()));
    }

    /**
     * The providerPost operation.
     * 
     * @param body The request body.
     * @param context The context to associate with this operation.
     * @throws IllegalArgumentException thrown if parameters fail the validation.
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return the response body along with {@link Response}.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    public Response<ChangeAllowanceResultInner> providerPostWithResponse(ChangeAllowanceRequest body, Context context) {
        if (this.client.getEndpoint() == null) {
            throw LOGGER.atError()
                .log(new IllegalArgumentException(
                    "Parameter this.client.getEndpoint() is required and cannot be null."));
        }
        if (this.client.getSubscriptionId() == null) {
            throw LOGGER.atError()
                .log(new IllegalArgumentException(
                    "Parameter this.client.getSubscriptionId() is required and cannot be null."));
        }
        if (body != null) {
            body.validate();
        }
        final String accept = "application/json";
        return service.providerPostSync(this.client.getEndpoint(), this.client.getApiVersion(),
            this.client.getSubscriptionId(), accept, body, context);
    }

    /**
     * The providerPost operation.
     * 
     * @throws ManagementException thrown if the request is rejected by server.
     * @throws RuntimeException all other wrapped checked exceptions if the request fails to be sent.
     * @return the response.
     */
    @ServiceMethod(returns = ReturnType.SINGLE)
    public ChangeAllowanceResultInner providerPost() {
        final ChangeAllowanceRequest body = null;
        return providerPostWithResponse(body, Context.NONE).getValue();
    }

    private static final ClientLogger LOGGER = new ClientLogger(OptionalBodiesClientImpl.class);
}
