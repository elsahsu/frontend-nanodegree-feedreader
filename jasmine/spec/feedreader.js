/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against the application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This suite is all about the RSS feeds definitions, the
     * allFeeds variable in our application.
     */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty.
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        /* Loop through each feed in the allFeeds object and ensures
         * it has a URL defined and that the URL is not empty.
         */
        it('each feed has URL defined and the URL is not empty', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.url).toBeDefined();
                expect(feed.url.length).not.toBe(0);
            });
        });

        /* Loops through each feed in the allFeeds object and ensures
         * it has a name defined and that the name is not empty.
         */
        it('each feed has name defined and the name is not empty', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.name).toBeDefined();
                expect(feed.name.length).not.toBe(0);
            });
        });
    });

    /* Test suite for the menu */
    describe('The menu', function() {
        /* Ensure the menu element is hidden by default.
         */
        it('is hidden by default', function() {
            expect($('body').hasClass('menu-hidden')).toBe(true);
        });

         /* Ensure the menu changes visibility when the menu icon is
          * clicked. First click makes menu visible, second click
          * hides it again.
          */
        it('is shown when menu icon is clicked and hidden when clicked again', function() {
            let menuIcon = $('.menu-icon-link');
            expect($('body').hasClass('menu-hidden')).toBe(true);
            menuIcon.click();
            expect($('body').hasClass('menu-hidden')).toBe(false);
            menuIcon.click();
            expect($('body').hasClass('menu-hidden')).toBe(true);
        });
    });

    /* Test suite for initial entries */
    describe('Initial Entries', function() {

        beforeEach(function(done) {
            loadFeed(1, done);
        }, 20000); // Increase timeout a bit, fetching feeds takes time.

        /* Ensure that the there is at least a single .entry element
         * within the .feed container after loadFeed finishes.
         */
        it('feed container has initially at least one entry', function(done) {
            let feed_container = $('.feed');
            expect(feed_container.children().length).toBeGreaterThan(0);
            let feed_contents = $('.feed > .entry-link');
            expect(feed_container.length).toBeGreaterThan(0);
            done();
        });
    });

    /* Test suite for selecting new feed */
    describe('New Feed Selection', function() {
        let original_feed_id = 0;
        let new_feed_id = 1;
        let original_feed_contents = null;
        let new_feed_contents = null;

        /* Call loadFeed twice: First with original feed id, wait
         * for loadFeed to finish, then store contents to variable
         * and call loadFeed with different index. Again wait for
         * loadFeed to finish, then store contents to another
         * variable, then we are done.
         */
        beforeEach(function(done) {
            loadFeed(original_feed_id, function() {
                original_feed_contents = $('.feed').children();
                loadFeed(new_feed_id, function() {
                    new_feed_contents = $('.feed').children();
                    done();
                });
            });
        }, 20000); // Increase timeout a bit, fetching feeds takes time.

        /* Ensure that when a new feed is loaded by the loadFeed
         * function that the content actually changes.
         */
        it('feed contents change when calling loadFeed with new index', function(done) {
            expect(original_feed_contents.length).toBeGreaterThan(0);
            expect(new_feed_contents.length).toBeGreaterThan(0);
            let original_first_element = original_feed_contents[0];
            let new_first_element = new_feed_contents[0];
            expect(original_first_element).toBeDefined();
            expect(new_first_element).toBeDefined();
            expect(new_first_element.href).not.toEqual(original_first_element.href);
            done();
        });
    });

    /* Test calling loadFeed with illegal index arguments */
    describe('Feed index error handling', function() {

        it('feed index out of bounds', function() {
            expect(function() { loadFeed(allFeeds.length); }).not.toThrow();
        });

        it('negative feed index', function() {
            expect(function() { loadFeed(-1); }).not.toThrow();
        });

        it('undefined feed index', function() {
            expect(function() { loadFeed(); }).not.toThrow();
        });

    });
}());
