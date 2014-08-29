// Convert to table
(function($){
    
    $.fn.extend({
        mivhak: function (settings) {
            return this.each(function () {
                new Mivhak( this, settings );
            });
        }
    });
    
    /**
     * Call
     * @param {type} func
     * @returns {Function}
     */
    function partial(func /*, 0..n args */) 
    {
        var args = Array.prototype.slice.call(arguments, 1);
        return function() {
            var allArguments = args.concat(Array.prototype.slice.call(arguments));
            return func.apply(this, allArguments);
        };
    }
    
    function Mivhak( root, settings )
    {
        var defaults = {
            auto_assign : false,    // comma delimited list of tags ('tag1,tag2')
            show_meta   : false,
            line_numbers: false
        };
        
        var self = this;
        
        this.buttons = [
            {
                description : 'Copy this code to clipboard',
                class       : 'mivhak-icon copy-icon',
                func        : function( wrapper, button ){
                    var plaintext = $(wrapper).find('.plain-text');
                    plaintext.toggle();
                    $(button).toggleClass('active');
                    self.textarea_adjust(plaintext[0]);
                    plaintext.select();
                }
            },
            {
                description : 'Open this code in a new window',
                class       : 'mivhak-icon expand-icon',
                func        : function( wrapper ){
                    var win = window.open('','','width=500,height=330,resizable=1');
                    win.document.write($(wrapper).find('.plain-text').html().replace(/\n/g,"<br>"));
                }
            },
            {
                description : 'Wrap lines',
                class       : 'mivhak-icon wrap-icon',
                func        : function( wrapper, button ){
                    if($(button).hasClass('active'))
                    {
                        $(wrapper).css({"white-space": "pre"});
                    }
                    else
                    {
                        $(wrapper).css({"white-space": "pre-wrap"});
                    }
                    $(button).toggleClass('active');
                }
            }
        ];
        
        this.config = this.merge_options( defaults, settings );
        this.root = root;
        
        // Assign the class 'prettyprint' to all code segments
        if(this.config.auto_assign !== "")
        {
            $(this.root).find(this.config.auto_assign).each(function(){
                $(this).addClass('prettyprint');
            });
        }
        
        // Assign the class 'linenums' to all code segments except for <code>
        if(this.config.line_numbers)
        {
            $(this.root).find('.prettyprint').each(function(){
                // Skip <code> elements
                if( this.tagName !== "CODE" )
                {
                    $(this).addClass('linenums');
                }
            });
        }
        
        // HTML encode
        $(this.root).find('.prettyprint').each(function(){
            $(this).text( $(this).html() );
        });
        
        prettyPrint( partial(this.init, this), root );
    }
    
    /**
     * Initiate
     * @param {type} self 
     * @returns {undefined}
     */
    Mivhak.prototype.init = function ( self )
    {
        // Loop through prettified code segments
        $(self.root).find('.prettyprinted').each(function()
        {
            // Skip <code> elements
            if( this.tagName !== "CODE" )
            {
                self.tabulate( this );
            }
        });
    };
    
    /**
     * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1.
     *
     * @param obj1
     * @param obj2
     *
     * @returns obj3 a new object based on obj1 and obj2
     */
    Mivhak.prototype.merge_options = function (obj1, obj2)
    {
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    };
    
    /**
     * Reformat code segment as a table, rather than a list.
     * 
     * @param {type} el The code segment to tabulate.
     * @returns {undefined}
     */
    Mivhak.prototype.tabulate = function ( el )
    {
        var lineNums    = $(el).attr("class").match(/\blinenums\b(?::(\d+))?/);
        var curLine     = 1;
        var table       = document.createElement('table');
        var tbody       = document.createElement('tbody');
        var wrapper     = document.createElement('div');
        var plainText   = document.createElement('textarea');
        
        table.className     = "code";
        plainText.className = "plain-text";
        wrapper.className   = "code-wrapper";
        
        // With line numbers
        if( lineNums )
        {
            curLine = lineNums[1] && lineNums[1].length ? lineNums[1] : curLine;
            
            $(el).children('ol').find('li').each(function(){
                var row = document.createElement('tr');
                var ln = document.createElement('td');
                var lc = document.createElement('td');

                ln.innerHTML = curLine;
                ln.className = "LN";
                lc.innerHTML = this.innerHTML;
                lc.className = "LC L" + (curLine++ % 10);
                row.appendChild(ln);
                row.appendChild(lc);

                $(tbody).append(row);
            });
            
            var text = "";
            var rows = $(el).children('ol').find('li');
            rows.each(function(i){
                text += $(this).text();
                if( i < rows.length - 1 )
                {
                    text += "\n";
                }
            });
            $(plainText).html(text.replace(/ /g, "&nbsp;")).hide();
            
            $(table).append(tbody);
            $(wrapper).append(table, plainText);
            $(el).append(wrapper);
            $(el).children('ol').remove();
            
            if(this.config.show_meta)
            {
                $(el).prepend(this.get_header( wrapper ));
            }
        }
        
        // Without line numbers
        else
        {
            $(el).wrapInner(wrapper);
            $(plainText).html($(el).text().replace(/ /g, "&nbsp;"));
            $(el).find('.code-wrapper').append(plainText);
            $(plainText).hide();
            
            if(this.config.show_meta)
            {
                $(el).prepend(this.get_header( $(el) ));
            }
        }
    };
    
    /**
     * Adjust the height and width of a textarea according to its content.
     * 
     * @param {type} o
     * @returns {undefined}
     */
    Mivhak.prototype.textarea_adjust = function(o) 
    {
        o.style.height = "1px";
        o.style.width = "1px";
        o.style.height = (o.scrollHeight)+"px";
        o.style.width = (25 + o.scrollWidth)+"px";
    };
    
    /**
     * Count the number of lines in this code block.
     * 
     * @param {type} wrapper
     * @returns {unresolved}
     */
    Mivhak.prototype.count_lines = function( input )
    {
        return $(input).val().split("\n").length;
    };
    
    /**
     * Generate the meta header for the code snippet
     * 
     * @param {type} wrapper
     * @returns {_L5.get_header.header|Element}
     */
    Mivhak.prototype.get_header = function( wrapper )
    {
        var header  = document.createElement('div');
        var text    = document.createElement('p');
        var control = document.createElement('p');
        
        header.className    = "meta";
        text.className      = "text";
        control.className   = "control";
        
        $(control).append(this.generate_buttons(wrapper));
        $(text).html(this.count_lines($(wrapper).find('textarea')) + " Lines");
        $(header).append(text, control);
        
        return header;
    };
    
    Mivhak.prototype.generate_buttons = function( wrapper )
    {
        var buttons = [];
        $.each( this.buttons, function(){
            var button = document.createElement('a');
            var icon = document.createElement('i');
            var func = this.func;
            
            icon.className = this.class;
            button.title = this.description;
            button.appendChild(icon);
            $(button).click(function(){
                func(wrapper, button);
            });
            buttons.push(button);
        });
        return buttons;
    };
    
    // Run!
    $(document).mivhak(mivhak_settings);
}(window.jQuery));