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
})
