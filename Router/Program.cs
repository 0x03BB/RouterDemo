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
app.UseStaticFiles();

app.UseRouting();
app.UseEndpoints(endpoints =>
{
    endpoints.MapFallbackToFile("index.html");
});

app.Run();
