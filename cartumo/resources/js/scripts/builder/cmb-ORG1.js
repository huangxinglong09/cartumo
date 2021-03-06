class Cmb {
    constructor() {

        let dragSrcEl = null;
        let dragSrcElParent = null;

        // Initialize the draggable widget items from the right sidebar
        let initDraggableSidebarWidgets = function () {

            // let draggableItems = $('#widget-collection-list .column-items .item-wrapper .item');
             let draggableItems = $('.ui-draggable');
            //let draggableItems = $('.item-wrapper');
            let droppableItems = $('.ui-droppable');
            // console.log(draggableItems.length);

            /*$( draggableItems ).sortable({
                connectWith: ".cmb-wrapper",
                handle: ".portlet-header",
                cancel: ".portlet-toggle",
                placeholder: "portlet-placeholder ui-corner-all"
            });*/

            $(draggableItems).each(function (index, widget) {

                /*widget.setAttribute('draggable', 'true');
                widget.setAttribute('aria-grabbed', 'false');
                widget.setAttribute('tabindex', '0');*/

                dragSrcElParent = widget;

                widget.addEventListener('dragstart', dragStart);
                /*widget.addEventListener('dragenter', dragEnter);
                widget.addEventListener('dragleave', dragLeave);
                widget.addEventListener('dragover', dragOver);
                widget.addEventListener('drop', drop);
                widget.addEventListener('dragend', dragEnd);*/
            });

            $(droppableItems).each(function (index, widget) {

                widget.addEventListener('dragenter', dragEnter);
                widget.addEventListener('dragleave', dragLeave);
                widget.addEventListener('dragover', dragOver);
                widget.addEventListener('drop', drop);
                widget.addEventListener('dragend', dragEnd);
            });

            // open widget list on button click
            $(document).on('click', "#right-sidebar .option-links #open-widget-list", function () {

                let widgetCollectionList = $('#widget-collection-list');

                // console.log(widgetCollectionList);

                if (widgetCollectionList.hasClass('active')) {
                    widgetCollectionList.removeClass('active');
                } else {
                    widgetCollectionList.addClass('active');
                }
            });
        }();

        function dragStart(e) {

            // this.style.opacity = '0.4';  // this / e.target is the source node.

            dragSrcEl = e.target;
            // e.dataTransfer.effectAllowed = 'move';
            // e.dataTransfer.dropEffect = "copy";

            /*var img = document.createElement("div");
            img.classList.add('box-drag');
            e.dataTransfer.setDragImage(img, 0, 0);*/

            var crt = e.target.cloneNode(true);
            crt.style.backgroundColor = "red";
            e.dataTransfer.setDragImage(crt, 0, 0);

            e.dataTransfer.setData("text/plain", 'widget-' + e.target.getAttribute('data-element'));
        }

        function dragEnter(e) {

            // e.target.classList.add('drag-over');
            this.classList.add('drag-over');
            // dragSrcEl.classList.add('ui-sortable');

            /*e.target.sortable({

                start: function (event, ui) {
                    console.log(event);
                },
                change: function (event, ui) {
                    console.log(event);
                },
                update: function (event, ui) {
                    // $('#sortable li').removeClass('highlights');
                    console.log("Updated");
                }
            });*/

            /*let targetelem = e.target;
            console.log(dragSrcEl);
            console.log(targetelem.parentNode.insertBefore(dragSrcEl, targetelem.nextSibling));*/
            // targetelem.parentNode.insertBefore(this.dragSrcEl, targetelem.nextSibling);


            //console.log(e.target);
            console.log(dragSrcEl);

            /*$(dragSrcEl).sortable({

                start: function (event, ui) {
                    console.log(event);
                },
                change: function (event, ui) {
                    console.log(event);
                },
                update: function (event, ui) {
                    // $('#sortable li').removeClass('highlights');
                    console.log("Updated");
                }
            });*/
        }

        function dragLeave(e) {
            // e.target.classList.remove('drag-over');  // this / e.target is previous target element.
            this.classList.remove('drag-over');
        }

        function dragOver(e) {

            // e.preventDefault(); // drop() will not work without it

            /*if (e.preventDefault) {
                e.preventDefault(); // Necessary. Allows us to drop.
            }

            e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

            return false;*/

            e.preventDefault();
            // e.dataTransfer.dropEffect = "move";

            /*$(dragSrcEl).parent().sortable({

                start: function (event, ui) {
                    console.log(event);
                },
                change: function (event, ui) {
                    console.log(event);
                },
                update: function (event, ui) {
                    // $('#sortable li').removeClass('highlights');
                    console.log("UPDATED");
                }
            });*/
        }

        function drop(e) {

            if (e.stopPropagation) {
                e.stopPropagation(); // stops the browser from redirecting.
            }

            console.log("DROPED");
            /*console.log(e.dataTransfer.getData('text'));
            console.log("CLASS: " + e.target.parentElement.className);*/

            // Don't do anything if dropping the same column we're dragging.
            if (dragSrcEl != this) {
                console.log("DRAG CANCEL");
            }

            if ((e.target.parentElement.className.trim() !== 'item-wrapper') && (e.target.parentElement.className.trim() !== 'item ui-droppable') && (e.target.parentElement.className.trim() !== 'item') && (e.target.parentElement.className.trim() !== 'icon') && (e.target.parentElement.className.trim() !== 'widget-headline')) {

                let widget_id = e.dataTransfer.getData("text");
                // console.log("WIDGET ID: " + widget_id);

                let widgetContent = async function ajaxCall(url, data) {

                    const location = window.location.hostname;
                    const settings = {
                        method: 'POST',
                        headers: {
                            // Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        body: JSON.stringify(data), // body data type must match "Content-Type" header
                    };

                    // console.log(`http://${location}:8000/${url}`);

                    const contentData = await fetch(`http://${location}:8000/${url}`, settings)
                        .then(response => response.text())
                        .then(data => {

                            // console.log(data);

                            // $('#cm-builder').append("TEXT");

                            /*$('#cm-builder').append(data).sortable({

                                start: function (event, ui) {
                                    console.log(event);
                                },
                                change: function (event, ui) {
                                    console.log(event);
                                },
                                update: function (event, ui) {
                                    // $('#sortable li').removeClass('highlights');
                                    console.log("Updated");
                                }
                            });*/

                            $('#cm-builder .cm-section-wrapper').append(data);

                            // e.target.append(data);

                            $('.ui-sortable').each(function (index, element) {
                                $(element).sortable({

                                    start: function (event, ui) {
                                        console.log(event);
                                    },
                                    change: function (event, ui) {
                                        console.log(event);
                                    },
                                    update: function (event, ui) {
                                        // $('#sortable li').removeClass('highlights');
                                        console.log("Updated");
                                    }
                                });
                            });
                        });

                    return contentData;
                }('sidebar/widget/', {'id': widget_id});
            }
        }

        function dragEnd(e) {
            this.classList.remove('over');  // this / e.target is previous target element.
        }
    }
}

export default new Cmb();