import $ from 'jquery';
import {parse_json} from "./parse_json";


/**
 * Options is the JavaScript object used to populate the screen with text prompts
 * to send, and installs click listeners to handle actually sending these prompts
 *
 * Author: Grant Youngs
 */



/**
 * Constructs the available text messages options
 * @constructor
 */
export const Options = function(selector) {
    this.selector = selector;

    this.presetNumbersListeners();
    this.installCustomMessageClickListener();
    this.populateOptions();
}

/**
 * Populates the screen with text options
 */
Options.prototype.populateOptions = function() {
    var that = this;

    $(this.selector).html("<p>Loading...</p>");

    $.ajax({
        url: "post/getoptions.php",
        data: "",
        method: "POST",
        dataType: "text",

        success: function(data) {
            var json = parse_json(data);
            var options = json.options;
            var html = "";

            for (var i = 0; i < options.length; i++) {
                html += "<div class='option'>";
                html += "<p>" + options[i] + "</p>";
                html += "</div>";
            }

            $(that.selector).html(html).hide().fadeIn(500);

            // Install the click listeners
            that.installClickListeners();
        },
        error: function(xhr, status, error) {
            $(that.selector).html("<p>Uh oh, the website cannot load text options</p>");
            return;
        }
    });
}

/**
 * Installs click listeners on all options available
 */
Options.prototype.installClickListeners = function() {
    $(this.selector + " .option").click(function() {
        event.preventDefault();

        var textMessage = $(this).children("p").text();
        var to = $("#target-number").val();
        console.log("to: " + to);
        var toSend = "textMessage=" + textMessage + "&to='+1" + to + "'";
        console.log("toSend: " + toSend);

        $.ajax({
            url: "post/sendtext.php",
            data: toSend,
            method: "POST",
            success: function(data) {
                var json = parse_json(data);
                if(json.ok) {
                    // Text was successfully sent!
                    $("#target-number").val("");
                    $("#result-message").html("<p>Text successfully sent!</p>").show().delay(2000).fadeOut(500);
                }
                else {
                    // Text wasn't able to send
                    $("#result-message").html("<p>Error! " + json.errorMessage + "</p>");
                }
            },
            error: function(xhr, status, error) {
                // An error!
                $("#result-message").html("<p>Error: " + error + "</p>");
            }
        });
    })
}

Options.prototype.presetNumbersListeners = function() {
    $(".preset-number").click(function() {
        event.preventDefault();

        var number = $(this).html();
        console.log("Number: " + number);
        $("#target-number").val(number);
    });
}

Options.prototype.installCustomMessageClickListener = function() {
    $("#send-custom-message").click(function() {
        event.preventDefault();

        var textMessage = $("#custom-message").val();
        var to = $("#target-number").val();

        var toSend = "textMessage=" + textMessage + "&to='+1" + to + "'";

        $.ajax({
            url: "post/sendtext.php",
            data: toSend,
            method: "POST",
            success: function(data) {
                var json = parse_json(data);
                if(json.ok) {
                    // Text was successfully sent!
                    $("#target-number").val("");
                    $("#custom-message").val("");
                    $("#result-message").html("<p>Text successfully sent!</p>").show().delay(2000).fadeOut(500);
                }
                else {
                    // Text wasn't able to send
                    $("#result-message").html("<p>Error! " + json.errorMessage + "</p>");
                }
            },
            error: function(xhr, status, error) {
                // An error!
                $("#result-message").html("<p>Error: " + error + "</p>");
            }
        });
    });
}
