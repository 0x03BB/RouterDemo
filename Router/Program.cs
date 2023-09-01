using Microsoft.AspNetCore.StaticFiles;
using Router.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var app = builder.Build();

// Configure the HTTP request pipeline.

// API pipeline.
app.MapWhen(context => context.Request.Path.StartsWithSegments("/api"), api =>
{
    if (!app.Environment.IsDevelopment())
    {
        api.UseExceptionHandler(exceptionHandler =>
            exceptionHandler.Run(async context =>
                await Results.Problem().ExecuteAsync(context)));
    }

    api.UseRouting();
    api.UseEndpoints(endpoints =>
    {
        endpoints.MapWeatherForecast();
    });
});

// SPA pipeline.
var contentTypeProvider = new FileExtensionContentTypeProvider();
var mappings = contentTypeProvider.Mappings;
mappings[".html"] = "text/html; charset=utf-8";
mappings[".css"] = "text/css; charset=utf-8";
mappings[".js"] = "text/javascript; charset=utf-8";
var staticFileOptions = new StaticFileOptions()
{
    ContentTypeProvider = contentTypeProvider
};

app.UseStaticFiles(staticFileOptions);

app.UseRouting();
#pragma warning disable ASP0014 // Suggest using top level route registrations
app.UseEndpoints(endpoints =>
{
    endpoints.MapFallbackToFile("index.html", staticFileOptions);
});
#pragma warning restore ASP0014 // Suggest using top level route registrations

app.Run();
