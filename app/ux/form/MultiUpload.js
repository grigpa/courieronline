Ext.define('Ext.ux.form.MultiUpload', {
    extend: 'Ext.form.Panel',
    border: 0,
    alias: 'widget.multiupload',
    margins: '2 2 2 2',
    accept: ['pdf', 'jpg', 'png', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'bmp', 'xml',
        'zip', 'rar', '7z', 'rtf', 'jpeg', 'tif', 'tiff', 'txt'],
    fileslist: [],
    frame: false,
    items: [
        {
            xtype: 'filefield',
            buttonOnly: true,
            fieldLabel: 'Прикрепить файл',
            buttonText: 'Обзор',
            name: 'attachFile[]',
            buttonConfig: {
                scale: 'small',
                iconCls: 'icon-plus'
            },
            listeners: {
                change: function (view, value, eOpts) {
                    var parent = this.up('form');
                    parent.onFileChange(view, value, eOpts);
                }
            }

        }

    ],

    onFileChange: function (view, value/*, eOpts*/) {
        var fileNameIndex = value.lastIndexOf('/') + 1;
        if (fileNameIndex === 0) {
            fileNameIndex = value.lastIndexOf('\\') + 1;
        }
        var filename = value.substr(fileNameIndex);

        var IsValid = this.fileValidiation(view, filename);
        if (!IsValid) {
            return;
        }


        this.fileslist.push(filename);
        var addedFilePanel = Ext.create('Ext.form.Panel', {
            frame: false,
            border: 0,
            padding: 2,
            margin: '0 10 0 0',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [


                {
                    xtype: 'image',
                    listeners: {
                        beforerender: function (me/*, eOpts*/) {
                            var ext = filename.substr(filename.lastIndexOf('.') + 1);
                            me.setSrc('resources/icons/extensions/' + ext.toLowerCase() + '.png');
                        }
                    }
                },
                {
                    xtype: 'label',
                    width: 200,
                    margin: {top: -20, left: 5, right: 5, bottom: 5},
                    listeners: {
                        render: function (me/*, eOpts*/) {
                            function stringSize(obj, str)
                            {
                                var s = document.createElement("span")
                                s.innerHTML=str;
                                s.style.visibility="hidden";
                                s.style.whiteSpace="nowrap";
                                obj.appendChild(s);
                                var res={width:s.offsetWidth, height:s.offsetHeight};
                                obj.removeChild(s);
                                return res;
                            }

                            function truncString(obj, str) {
                                while (stringSize(obj, str).width > 150) {
                                    str = str.substr(0, str.length - 1);
                                }
                                return str;
                            }


                            if (stringSize(me.getEl().dom, filename).width > 180) {
                                me.setText(
                                    truncString(me.getEl().dom, filename.substr(0, filename.lastIndexOf('.') - 1))
                                        + '...' + filename.substr(filename.lastIndexOf('.') + 1)
                                );
                            } else {
                                me.setText(filename);
                            }
                        }

                    }
                },
                {
                    xtype: 'button',
                    text: null,
                    border: 0,
                    frame: false,
                    iconCls: 'icon-delete-white',
                    tooltip: 'Удалить',
                    listeners: {
                        click: function (me/*, e, eOpts*/) {
                            var currentform = me.up('form');
                            var mainform = currentform.up('form');
                            var lbl = currentform.down('label');
                            mainform.fileslist.pop(lbl.text);
                            mainform.remove(currentform);
                            currentform.destroy();
                            mainform.doLayout();
                        }
                    }
                }
            ]
        });

        var newUploadControl = Ext.create('Ext.form.FileUploadField', {
            buttonOnly: true,
            fieldLabel: 'Прикрепить файл',
            name: 'attachFile[]',
            buttonText: 'Обзор',
            buttonConfig: {
                scale: 'small',
                iconCls: 'icon-plus'
            },
            listeners: {
                change: function (view, value, eOpts) {

                    var parent = this.up('form');
                    parent.onFileChange(view, value, eOpts);
                }
            }
        });
        view.hide();
        addedFilePanel.add(view);
        this.insert(0, newUploadControl);
        this.add(addedFilePanel);


        // alert(filename);
    },

    fileValidiation: function (me, filename) {

        var isValid = true;
        var indexofPeriod = me.getValue().lastIndexOf('.'),
            uploadedExtension = me.getValue().substr(indexofPeriod + 1, me.getValue().length - indexofPeriod);
        if (!Ext.Array.contains(this.accept, uploadedExtension.toLowerCase())) {
            isValid = false;
            me.setActiveError('Пожалуйста, загружайте файлы указанных расширений: ' + this.accept.join());
            Ext.MessageBox.show({
                title: 'Ошибка',
                msg: 'Пожалуйста, загружайте файлы указанных расширений: ' + this.accept.join(),
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
            me.setRawValue(null);
            me.reset();
        }

        if (Ext.Array.contains(this.fileslist, filename)) {
            isValid = false;
            me.setActiveError('Файл ' + filename + ' уже добавлен!');
            Ext.MessageBox.show({
                title: 'Ошибка',
                msg: 'Файл ' + filename + ' уже добавлен!',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
            me.setRawValue(null);
            me.reset();
        }


        return isValid;
    }
});