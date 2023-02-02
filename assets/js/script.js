function clear() {
    $('input').val("");
    $('#articles').empty();
}

function getNumber(id, min, max) {
    // This returns the integer between the min and max
    if (parseInt($(id).val()) < min || parseInt($(id).val()) > max) {
        return false;
    }
    return parseInt($(id).val())
}
// Keep the numbers for the years in one place
let getYear = (id) => getNumber(id, 1851, 2023);
let getRecords = (id) => getNumber(id, 1, 100);
// make a query
let nytAPIKey = 'gao8Xg0lzf3aUkugAd2T4WfrEkyEr15d';
let query = (searchTerm, records, startYear, endYear, apiKey = nytAPIKey) => `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchTerm}&api-key=${apiKey}&begin_date=20120101&end_date=20121231`



function getString(id) {
    // This returns the integer between the min and max
    if ($(id).val() === "") {
        return false;
    }
    return $(id).val();
}

$('#search-btn').on("click", (event) => {
    event.preventDefault();
    let input = [getString('#search-term-input'), getRecords('#records-input'), getYear('#start-year-input'), getYear('#end-year-input')]
    // Check a term has been entered
    if (! input[0]) {
        console.log("empty search query")
        return
    }
    // default for number of articles
    if (input[1]) {
        input[1] = 5;
    }
    console.log(query(input[0],input[1],input[2],input[3]));
})
$('#clear-btn').on("click", (event) => {
    event.preventDefault();
    clear();
})

