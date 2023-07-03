using Microsoft.AspNetCore.StaticFiles;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

// API pipeline.
app.MapWhen(context => context.Request.Path.StartsWithSegments("/api"), api =>
{
    if (!app.Environment.IsDevelopment())
    {
        api.UseExceptionHandler("/api/error");
    }

    api.UseRouting();
    api.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
});

// SPA pipeline.
var contentTypeProvider = new FileExtensionContentTypeProvider();
var mappings = contentTypeProvider.Mappings;
mappings[".html"] += "; charset=utf-8";
mappings[".js"] += "; charset=utf-8";
var staticFileOptions = new StaticFileOptions()
{
    ContentTypeProvider = contentTypeProvider
};

app.UseStaticFiles(staticFileOptions);

app.UseRouting();
app.UseEndpoints(endpoints =>
{
    endpoints.MapFallbackToFile("index.html", staticFileOptions);
});

app.Run();
