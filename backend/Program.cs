using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("cors", policy =>
    {
        policy
            //.WithOrigins("http://localhost:5173", "http://192.168.1.10:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowed(_ => true)
            .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("cors");

app.MapHub<GameHub>("/game");

app.MapGet("/", () => "Backend OK");

app.Run();