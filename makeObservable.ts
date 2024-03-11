export function makeObservable<T>(): {
    generator: AsyncGenerator<T, void, void>,
    publish: (value: T) => void,
} {
    const resolvers: ((value: T) => void)[] = [];

    function getValue(): Promise<T> {
        return new Promise((resolve) => {
            resolvers.push(resolve);
        });
    }

    async function* createGenerator(): AsyncGenerator<T, void, void> {
        yield getValue();
        return;
    }

    function sendMessage(messages: T) {
        const resolver = resolvers.shift();
        if (resolver) {
            resolver(messages);
        }
    }

    return {
        generator: createGenerator(),
        publish: sendMessage,
    };
}
