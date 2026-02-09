new TestCase('Paging', {

    'test with availablePages=6 maxPagesCount=4': new TestWithProvider({
        data: [
            {input: 1, expected: '1,2,3,4'},
            {input: 2, expected: '1,2,3,4'},
            {input: 3, expected: '2,3,4,5'},
            {input: 4, expected: '3,4,5,6'},
            {input: 5, expected: '3,4,5,6'},
            {input: 6, expected: '3,4,5,6'},
            {input: 10, expected: '3,4,5,6'}, // invalid input
            {input: -10, expected: '1,2,3,4'} // invalid input
        ],
        test: function (input, expected) {
            var paging = new Ext.ux.Paging();
            assertEquals(paging.generatePages(input, 6, 4), expected.split(','));
        }
    }),

    'test with availablePages=6 maxPagesCount=5': new TestWithProvider({
        data: [
            {input: 1, expected: '1,2,3,4,5'},
            {input: 2, expected: '1,2,3,4,5'},
            {input: 3, expected: '2,3,4,5,6'},
            {input: 4, expected: '2,3,4,5,6'},
            {input: 5, expected: '2,3,4,5,6'},
            {input: 6, expected: '2,3,4,5,6'}
        ],
        test: function (input, expected) {
            var paging = new Ext.ux.Paging();
            assertEquals(paging.generatePages(input, 6, 5), expected.split(','));
        }
    }),

    'test with availablePages=4 maxPagesCount=5': new TestWithProvider({
        data: [
            {input: 1, expected: '1,2,3,4'},
            {input: 2, expected: '1,2,3,4'},
            {input: 3, expected: '1,2,3,4'},
            {input: 4, expected: '1,2,3,4'},
            {input: 5, expected: '1,2,3,4'},
            {input: 6, expected: '1,2,3,4'}
        ],
        test: function (input, expected) {
            var paging = new Ext.ux.Paging();
            assertEquals(paging.generatePages(input, 4, 5), expected.split(','));
        }
    })

});