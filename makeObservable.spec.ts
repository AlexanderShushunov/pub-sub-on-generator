import { makeObservable } from "./makeObservable";

describe("makeObservable", () => {
    it("should notify a subscriber upon new value publication", async () => {
        const {
            generator,
            publish,
        } = makeObservable<number>();
        const next = generator.next();
        publish(42);
        const {value} = await next
        expect(value).toEqual(42);
    });

    it("should notify several times a subscriber if several values were published in one 'tick'", async () => {
        const {
            generator,
            publish,
        } = makeObservable<number>();
        const next1 = generator.next();
        const next2 = generator.next();
        publish(42);
        publish(43);
        const {value: value1} = await next1
        expect(value1).toEqual(42);
        const {value: value2} = await next2
        expect(value2).toEqual(43);
    });

    it("should notify a subscriber if several values were published in different 'ticks'", async () => {
        const {
            generator,
            publish,
        } = makeObservable<number>();

        const next1 = generator.next();
        publish(42);
        const {value: value1} = await next1
        expect(value1).toEqual(42);

        await new Promise((resolve) => setTimeout(resolve, 0));
        publish(43);
        const next2 = generator.next();
        const {value: value2} = await next2
        expect(value2).toEqual(43);
    });

    it("should notify a subscriber if values were published before 'subscription'", async () => {
        const {
            generator,
            publish,
        } = makeObservable<number>();
        publish(42);
        publish(43);
        const {value: value1} = await generator.next()
        expect(value1).toEqual(42);
        const {value: value2} = await  generator.next()
        expect(value2).toEqual(43);
    });
})
