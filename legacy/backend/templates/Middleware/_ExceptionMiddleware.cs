using Grpc.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Backend.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILogger<ExceptionMiddleware> logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            this.next = next;
            this.logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            string request = $"{context.Request.Method}:{context.Request.Path}";
            try
            {
                await this.next.Invoke(context);
                this.logger.LogInformation($"{request} : done");                
            }
            catch (RpcException ex)
            {
                HttpStatusCode httpStatusCode = HttpStatusCode.BadRequest;
                if (ex.Status.StatusCode == StatusCode.NotFound)
                {
                    httpStatusCode = HttpStatusCode.NotFound;
                    this.logger.LogInformation($"{request} : done : gRPC not found");
                } else
                {
                    this.logger.LogError($"{request} : {ex}");
                }
                await HandleExceptionAsync(context, ex.Status.Detail, httpStatusCode);
            }
            catch (Exception ex)
            {
                this.logger.LogError($"{request} : {ex}");
                await HandleExceptionAsync(context, ex.Message);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, string message, HttpStatusCode httpCode = HttpStatusCode.BadRequest)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)httpCode;

            return context.Response.WriteAsync(message);
        }
    }   
}
