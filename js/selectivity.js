function escape(string) {
                return string ? String(string).replace(/[&<>"']/g, function(match) {
                    return {
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&quot;',
                        "'": '&#39;'
                    }[match];
                }) : '';
            }

                // ['Amsterdam', 'Antwerp', ...]
                var cities = $('#single-select-box').find('option').map(function() {
                    return this.textContent;
                }).get();

                // [ { text: 'Austria', children: [ { id: 54, text: 'Vienna' } ] }, ... ]
                var citiesByCountry = $('#multiple-select-box').find('optgroup').map(function() {
                    return {
                        text: this.getAttribute('label'),
                        children: $(this).find('option').map(function() {
                            return {
                                id: parseInt(this.getAttribute('value'), 10),
                                text: this.textContent
                            };
                        }).get()
                    };
                }).get();

                // [{ id: 'Amsterdam', timezone: '+01:00' }, ...]
                var citiesWithTimezone = $('#multiple-select-box').find('option').map(function() {
                    return {
                        id: this.textContent,
                        timezone: this.getAttribute('data-timezone')
                    };
                }).get();

                var transformText = $.fn.selectivity.transformText;

                // example query function that returns at most 10 cities matching the given text
                function queryFunction(query) {
                    var selectivity = query.selectivity;
                    var term = query.term;
                    var offset = query.offset || 0;
                    var results;
                    if (selectivity.$el.attr('id') === 'single-input-with-submenus') {
                        var timezone = selectivity.dropdown.highlightedResult.id;
                        results = citiesWithTimezone.filter(function(city) {
                            return transformText(city.id).indexOf(transformText(term)) > -1 &&
                                   city.timezone === timezone;
                        }).map(function(city) { return city.id });
                    } else {
                        results = cities.filter(function(city) {
                            return transformText(city).indexOf(transformText(term)) > -1;
                        });
                    }
                    results.sort(function(a, b) {
                        a = transformText(a);
                        b = transformText(b);
                        var startA = (a.slice(0, term.length) === term),
                            startB = (b.slice(0, term.length) === term);
                        if (startA) {
                            return (startB ? (a > b ? 1 : -1) : -1);
                        } else {
                            return (startB ? 1 : (a > b ? 1 : -1));
                        }
                    });
                    setTimeout(function() {
                        query.callback({
                            more: results.length > offset + 10,
                            results: results.slice(offset, offset + 10)
                        });
                    }, 500);
                }

                $('#single-input').selectivity({
                    allowClear: true,
                    placeholder: 'No city selected',
                    query: queryFunction,
                    searchInputPlaceholder: 'Type to search a city',
                });

                $('#single-input-without-search').selectivity({
                    allowClear: true,
                    items: cities,
                    placeholder: 'No city selected',
                    showSearchInputInDropdown: false
                });

                $('#single-input-with-labels').selectivity({
                    allowClear: true,
                    items: citiesByCountry,
                    placeholder: 'No city selected',
                    searchInputPlaceholder: 'Type to search a city'
                });

                var submenu = {
                    query: queryFunction,
                    showSearchInput: true
                };

                $('#single-input-with-submenus').selectivity({
                    allowClear: true,
                    items: [
                        { text: 'Western European Time Zone', id: '+00:00', submenu: submenu },
                        { text: 'Central European Time Zone', id: '+01:00', submenu: submenu },
                        { text: 'Eastern European Time Zone', id: '+02:00', submenu: submenu }
                    ],
                    placeholder: 'No city selected',
                    showSearchInputInDropdown: false
                });

                $('#multiple-input').selectivity({
                    multiple: true,
                    placeholder: 'Type to search cities',
                    query: queryFunction
                });

                

                $('#single-select-box').selectivity();

                $('#multiple-select-box').selectivity();

                
           