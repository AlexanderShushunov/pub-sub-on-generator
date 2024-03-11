export function makeObservable<T>(): {
    generator: AsyncGenerator<T, void, void>,
    publish: (value: T) => void,
} {
    const buffer: T[] = [];
    const resolvers: ((value: T) => void)[] = [];

    async function getValue(): Promise<T> {
        const fromBuffer = buffer.shift();
        if (fromBuffer !== undefined) {
            return fromBuffer;
        }
        return new Promise((resolve) => {
            resolvers.push(resolve);
        });
    }

    async function* createGenerator(): AsyncGenerator<T, void, void> {
        while (true) {
            yield getValue();
        }
    }

    function sendMessage(messages: T) {
        const resolver = resolvers.shift();
        if (resolver) {
            resolver(messages);
        } else {
            buffer.push(messages);
        }
    }

    return {
        generator: createGenerator(),
        publish: sendMessage,
    };
}
