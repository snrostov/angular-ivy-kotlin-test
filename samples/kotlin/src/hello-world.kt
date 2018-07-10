@Component(
    selector = "hello-world",
    template = """
        <h3>Hello {{name}} {{test()}}</h3>
    """
)
class HelloWorld {
    val name = "World!"

    fun test() = "test"
}

fun main() {
    renderComponent(HelloWorld::class.js as ComponentType<HelloWorld>);
}
