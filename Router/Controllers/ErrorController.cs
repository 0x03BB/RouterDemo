namespace Router.Controllers;

[ApiController]
public sealed class ErrorController : ControllerBase
{
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    [Route("api/error")]
    public IActionResult HandleError() => Problem();
}
