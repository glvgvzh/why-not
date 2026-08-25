describe('mock functions', () => {
    test('tracks number of calls', () => {
        const handler = jest.fn()
        handler()
        handler()
        handler()
        expect(handler).toHaveBeenCalledTimes(3)
    })
    
    test('tracks passed arguments', () => {
        const handler = jest.fn()
        handler('string', 123)
        expect(handler).toHaveBeenCalledWith('string', 123)
    })
})
