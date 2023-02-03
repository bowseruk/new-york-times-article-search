// Clear everything
function clear() {
    $('input').val("");
    $('#articles').empty();
}
// Get a number from an input with the id given
function getNumber(id, min, max) {
    // This returns the integer between the min and max
    if (parseInt($(id).val()) < min || parseInt($(id).val()) > max) {
        return false;
    }
    return parseInt($(id).val())
}
// Get a string from an input with the id given
function getString(id) {
    // This returns the integer between the min and max
    if ($(id).val() === "") {
        return false;
    }
    return $(id).val();
}
// Render article from response
function renderArticles(response, maxResponse) {
    response.response.docs.slice(0, Math.min(maxResponse, response.response.docs.length)).forEach(article => {
        console.log(article)
        // Create a function too make list elements
        let li = (text) => $('<li>').addClass("list-group-item").text(text);
        let liA = (text, href) => li("").append($("<a>").attr("href", href).text(text))
        let pubDate = li(dayjs(article['pub_date']).format('YYYY-MM-DD'));
        let section = li(article['section_name'])
        let synopsis = li(article.abstract)
        let link = liA(article.web_url, article.web_url)
        // Append all the items with dot notation
        $('#articles').append($('<div>').addClass("card").append($('<h2>').addClass("card-header").text(article.headline.main)).append($('<div>').addClass("card-body").append($('<ul>').addClass("list-group list-group-flush").append(pubDate).append(section).append(synopsis).append(link))));
    })
    return (response.response.docs.length < 10) ? false : true;
}

// Keep the numbers for the years in one place
let getYear = (id) => getNumber(id, 1851, 2023);
let getRecords = (id) => getNumber(id, 1, 99);
// make a query
let nytAPIKey = 'gao8Xg0lzf3aUkugAd2T4WfrEkyEr15d';
let query = (searchTerm, page, startYear, endYear, apiKey = nytAPIKey) => `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchTerm}&api-key=${apiKey}${(startYear) ? `&page=${page}` : ''}${(startYear) ? `&begin_date=${startYear}0101` : ''}${(endYear) ? `&end_date=${endYear}1231` : ''}`

// Search for the query
function getPage(queryURL, maxResponse = 10) {
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then((response) => renderArticles(response, maxResponse))
}

$('#search-btn').on("click", (event) => {
    event.preventDefault();
    let input = [getString('#search-term-input'), getRecords('#records-input'), getYear('#start-year-input'), getYear('#end-year-input')]
    // Check a term has been entered
    if (!input[0]) {
        console.log("empty search query")
        return
    }
    // default for number of articles
    if (!input[1]) {
        input[1] = 5;
    }
    // If the start date is larger than the end date
    if (input[2] && input[3] && input[2] > input[3]) {
        let temp = input[3]
        input[3] = input[2];
        input[2] = temp;
    }
    clear();
    // Check the number of articles requested
    for (let i = 0; i < (Math.floor(input[1] / 10)); i++) {
        getPage(query(input[0], i, input[2], input[3]))
    }
    getPage(query(input[0], Math.floor(input[1] / 10), input[2], input[3]), input[1] % 10)
})
$('#clear-btn').on("click", (event) => {
    event.preventDefault();
    clear();
})

