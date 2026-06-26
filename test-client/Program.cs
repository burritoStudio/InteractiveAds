using Microsoft.AspNetCore.SignalR.Client;

var connection = new HubConnectionBuilder()
    .WithUrl("http://localhost:5211/game")
    .WithAutomaticReconnect()
    .Build();

connection.On<string>("move", (direction) =>
{
    Console.WriteLine("Recibido: " + direction);
});

await connection.StartAsync();

Console.WriteLine("Conectado al backend");

// simulación de celular
while (true)
{
    await connection.SendAsync("Move", "left");
    await Task.Delay(2000);
}
