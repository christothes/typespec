// <auto-generated/>

#nullable disable

using System;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.Threading;
using System.Threading.Tasks;

namespace Payload.JsonMergePatch
{
    public partial class JsonMergePatchClient
    {
        public JsonMergePatchClient() : this(new Uri("http://localhost:3000"), new JsonMergePatchClientOptions()) => throw null;

        public JsonMergePatchClient(Uri endpoint, JsonMergePatchClientOptions options) => throw null;

        public ClientPipeline Pipeline => throw null;

        public virtual ClientResult CreateResource(BinaryContent content, RequestOptions options = null) => throw null;

        public virtual Task<ClientResult> CreateResourceAsync(BinaryContent content, RequestOptions options = null) => throw null;

        public virtual ClientResult<Resource> CreateResource(Resource body, CancellationToken cancellationToken = default) => throw null;

        public virtual Task<ClientResult<Resource>> CreateResourceAsync(Resource body, CancellationToken cancellationToken = default) => throw null;

        public virtual ClientResult UpdateResource(BinaryContent content, RequestOptions options = null) => throw null;

        public virtual Task<ClientResult> UpdateResourceAsync(BinaryContent content, RequestOptions options = null) => throw null;

        public virtual ClientResult UpdateOptionalResource(BinaryContent content = null, RequestOptions options = null) => throw null;

        public virtual Task<ClientResult> UpdateOptionalResourceAsync(BinaryContent content = null, RequestOptions options = null) => throw null;
    }
}
