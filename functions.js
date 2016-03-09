/**
 * Created by duy on 3/8/16.
 */

$(function () {
    var $sepDistSlider = $('#separation-distance-slider');
    var $aliDistSlider = $('#alignment-distance-slider');
    var $cohDistSlider = $('#cohesion-distance-slider');

    var $sepDistInput = $('#separation-distance-value');
    var $aliDistInput = $('#alignment-distance-value');
    var $cohDistInput = $('#cohesion-distance-value');

    var $sepWeightSlider = $('#separation-multiplier-slider');
    var $aliWeightSlider = $('#alignment-multiplier-slider');
    var $cohWeightSlider = $('#cohesion-multiplier-slider');

    var $sepWeightInput = $('#separation-multiplier-value');
    var $aliWeightInput = $('#alignment-multiplier-value');
    var $cohWeightInput = $('#cohesion-multiplier-value');

    // Seperation Distance Slider
    $sepDistSlider
        .rangeslider({
            polyfill: true
        })
        .on('input', function () {
            $sepDistInput[0].value = this.value;
            SEPARATION_DISTANCE = this.value;
        });

    // Separation Distance input field
    $sepDistInput.on('input', function () {
        $sepDistSlider.val(this.value).change();
        SEPARATION_DISTANCE = this.value;
    });

    // Alignment Distance Slider
    $aliDistSlider
        .rangeslider({
            polyfill: true
        })
        .on('input', function () {
            $aliDistInput[0].value = this.value;
            ALIGNMENT_DISTANCE = this.value;
        });

    // Alignment Distance input field
    $aliDistInput.on('input', function () {
        $aliDistSlider.val(this.value).change();
        ALIGNMENT_DISTANCE = this.value;
    });

    // Cohesion Distance Slider
    $cohDistSlider
        .rangeslider({
            polyfill: true
        })
        .on('input', function () {
            $cohDistInput[0].value = this.value;
            COHESION_DISTANCE = this.value;
        });

    // Cohesion Distance input field
    $cohDistInput.on('input', function () {
        $cohDistSlider.val(this.value).change();
        COHESION_DISTANCE = this.value;
    });

    // Separation Weight Slider
    $sepWeightSlider
        .rangeslider({
            polyfill: true
        })
        .on('input', function () {
            $sepWeightInput[0].value = this.value;
            SEPARATION_MULTIPLIER = this.value;
        });

    // Separation Weight input field
    $sepWeightInput.on('input', function () {
        $sepWeightSlider.val(this.value).change();
        SEPARATION_MULTIPLIER = this.value;
    });

    // Alignment Weight Slider
    $aliWeightSlider
        .rangeslider({
            polyfill: true
        })
        .on('input', function () {
            $aliWeightInput[0].value = this.value;
            ALIGNMENT_MULTIPLIER = this.value;
        });

    // Alignment  Weight input field
    $aliWeightInput.on('input', function () {
        $aliWeightSlider.val(this.value).change();
        ALIGNMENT_MULTIPLIER = this.value;
    });

    // Cohesion Weight Slider
    $cohWeightSlider
        .rangeslider({
            polyfill: true
        })
        .on('input', function () {
            $cohWeightInput[0].value = this.value;
            COHESION_MULTIPLIER = this.value;
        });

    // Cohesion Weight input field
    $cohWeightInput.on('input', function () {
        $cohWeightSlider.val(this.value).change();
        COHESION_MULTIPLIER = this.value;
    });
});

// Disable LOAD button until SAVE button is clicked on
$(function () {
    var button = $("#save"),
        submitButt = $("#load");
    button.on("click", function (e) {
        submitButt.prop("disabled", false); // NOT a toggle
    });
});


var drawTextWithOutline = function (ctx, font, text, x, y, fillColor, outlineColor, outlineWidth) {
    ctx.font = font;
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = outlineWidth ? outlineWidth : 5;
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 5;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fillColor;
    ctx.fillText(text, x, y);
};

