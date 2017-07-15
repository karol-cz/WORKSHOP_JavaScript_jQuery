$(document).ready(function() {
    getAllBooks();
});

function getAllBooks() {
    var url = "http://localhost:8282/books";
    ajaxRequest(url, createBookList);
}

function createBookList(result) {
    $('#books_list').html('');
    for (var i = 0; i < result.length; i++) {

        var deleteButton = $('<button>');
        deleteButton.text('delete');
        deleteButton.attr('data-id', $(result).eq(i).attr('id'));
        deleteButton.addClass('delete_book_button_class');

        var titleDiv = $('<div>').html("&nbsp&nbsp" + result[i].title);
        titleDiv.addClass('title');
        titleDiv.attr('data-id', $(result).eq(i).attr('id'));

        var descriptionDiv = $('<div><p>');
        descriptionDiv.addClass('description_div_class');

        var titleAndButtonDiv = $('<div>');
        titleAndButtonDiv.addClass('books_list_line');
        titleAndButtonDiv.attr('id', $(result).eq(i).attr('id'));
        titleAndButtonDiv.append(deleteButton);
        titleAndButtonDiv.append(titleDiv);
        titleAndButtonDiv.append(descriptionDiv);

        //dodawanie nowej zawartosci diva
        $('#books_list').append(titleAndButtonDiv);
    }
}

$('#div_list').one('click', '.title', showBookDetails);

function showBookDetails() {
    var bookDescriptionDiv = $(this).parent().find('.description_div_class');
    var url = "http://localhost:8282/books/" + $(this).attr('data-id');
    ajaxRequest(url, fillBookDetails, "GET", "", bookDescriptionDiv);
    $('body').one('click', '.title', hideBookDetails);
}

function hideBookDetails() {
    $(this).parent().find('.description_div_class').html('<br>');
    $('body').one('click', '.title', showBookDetails);
}

function fillBookDetails(result, element) {
    var detailInfo = '';
    jQuery.each(result, function(i, val) {
        detailInfo += i + ': ' + val + '<br>';
    });
    detailInfo += '<br>';
    element.html(detailInfo);
}

$('#div_list').on('click', '.delete_book_button_class', function() {
    url = "http://localhost:8282/books/remove/" + $(this).attr('data-id');
    ajaxRequest(url, getAllBooks, 'DELETE');
});

$('[type="submit"]').on('click', function(event) {
    event.preventDefault();
    var form = $('form');
    var json = {
        "isbn": form.find('input[name="isbn"]').val(),
        "title": form.find('input[name="title"]').val(),
        "author": form.find('input[name="author"]').val(),
        "publisher": form.find('input[name="publisher"]').val(),
        "type": form.find('input[name="text"]').val()
    };
    url = "http://localhost:8282/books/add";
    ajaxRequest(url, clearForm, 'POST', json);
});

function clearForm() {
    getAllBooks();
    $('form').find('input[type="text"]').each(function() {
        $(this).val('');
    });
}

function ajaxRequest(url, callback, method, json, element) {
    $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: url,
            type: method || 'GET',
            data: JSON.stringify(json)
        })
        .done(function(result) {
            callback(result, element);
        });
}
