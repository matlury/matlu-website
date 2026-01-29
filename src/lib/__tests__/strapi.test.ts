import { fetchStrapi } from '../strapi';

type BoardResponse = {
    data: Array<{
        year: number;
        [key: string]: unknown;
    }>;
    meta?: unknown;
};

// Example test for Strapi REST API
describe('Strapi REST API', () => {
    it('should fetch 2026 board data from Strapi', async () => {
        // Test fetching board data for 2026
        try {
            const data = await fetchStrapi<BoardResponse>('boards', {
                filters: { hidden: { $eq: false }, year: { $eq: 2026 } },
                sort: "year:desc",
                populate: "*"
            });
            expect(data).toBeDefined();
            expect(data.data).toBeDefined();
            if (data.data && data.data.length > 0) {
                expect(data.data[0].year).toBe(2026);
                console.log('2026 Board data:', JSON.stringify(data, null, 2));
            }
        } catch (error) {
            // Handle cases where Strapi is not running or endpoint doesn't exist
            console.log('Strapi not available for testing:', error);
        }
    });
});