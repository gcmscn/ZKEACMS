﻿angular.module("fieldSetting", []).controller("setting", ['$scope', '$filter', function ($scope, $filter) {
    $scope.templates = [
        {
            Name: "SingleLine",
            DisplayName: "单行输入",
            Description: "",
            Placeholder: "",
            IsRequired: false,
            Size: 4,
            Column: "col-md-12"
        },
        {
            Name: "Number",
            DisplayName: "数字",
            Description: "",
            Placeholder: "",
            IsRequired: false,
            Size: 4,
            Column: "col-md-12"
            //AdditionalSettings: [{ DisplayText: "最大值", Name: "num-max", Value: "" }, { DisplayText: "最小值", Name: "mum-min", Value: "" }]
        },
        {
            Name: "Email",
            DisplayName: "邮箱地址",
            Description: "",
            Placeholder: "",
            IsRequired: false,
            Size: 4,
            Column: "col-md-12"
        },
        {
            Name: "Paragraph",
            DisplayName: "多行输入",
            Description: "",
            Placeholder: "",
            IsRequired: false,
            Size: 4,
            Column: "col-md-12"
        },
        {
            Name: "Date",
            DisplayName: "日期",
            Description: "",
            IsRequired: false,
            Size: 4,
            Column: "col-md-12"
        },
        {
            Name: "Radio",
            DisplayName: "单项选择",
            Description: "",
            IsRequired: false,
            Size: 4,
            Column: "col-md-12",
            FieldOptions: [{ DisplayText: "选项1" }, { DisplayText: "选项2" }]
        },
        {
            Name: "Dropdown",
            DisplayName: "下拉选项",
            Description: "",
            IsRequired: false,
            Size: 4,
            Column: "col-md-12",
            FieldOptions: [{ DisplayText: "选项1" }, { DisplayText: "选项2" }],
        },
        {
            Name: "Checkbox",
            DisplayName: "多项选择",
            Description: "",
            IsRequired: false,
            Size: 4,
            Column: "col-md-12",
            FieldOptions: [{ DisplayText: "选项1" }, { DisplayText: "选项2" }]
        },
        {
            Name: "Address",
            DisplayName: "省份地址",
            Description: "",
            IsRequired: false,
            Size: 4,
            Column: "col-md-12"
        },
        {
            Name: "Label",
            DisplayName: "标题",
            Description: "",
            Placeholder: "",
            IsRequired: false,
            Size: 4,
            Column: "col-md-12"
        }
    ];

    if ($scope.Fields == null || $scope.Fields.length == 0) {
        $scope.Fields = [angular.copy($scope.templates[0])];
    }
    $scope.fieldInfo = $scope.Fields[0];
    $scope.editTemplate = function (data) {
        $scope.fieldInfo = data;
    }
    $scope.setFieldWidth = function (data, width) {
        data.Style = { width: width };
    }
    $scope.setDefaultOption = function (data, option) {
        for (var i = 0; i < data.FieldOptions.length; i++) {
            data.FieldOptions[i].DefaultSelected = false;
        }
        option.DefaultSelected = true;
        data.DefaultSelect = option;
    }
    $scope.removeField = function (field) {
        $scope.Fields = $scope.Fields.filter(function (item) { return item != field });
    }
    $scope.removeOption = function (options, option) {
        var removeIndex = 0;
        for (var i = 0; i < options.length; i++) {
            if (options[i] == option) {
                removeIndex = i;
            }
        }
        options.splice(removeIndex, 1);
    }
    $scope.addOption = function (options) {
        options.push({ DisplayText: "", Value: "", DefaultSelected: false });
    }
    var orderBy = $filter('orderBy');
    $scope.sortOptions = function (options, reverse) {
        options = orderBy(options, "DisplayText", reverse);
        for (var i = 0; i < options.length; i++) {
            options[i].Order = i + 1;
        }
    }
    $scope.showOptionValue = function (data, showValue) {
        data.ShowValue = showValue;
        for (var i = 0; i < data.FieldOptions.length; i++) {
            if (!data.FieldOptions[i].Value) {
                data.FieldOptions[i].Value = data.FieldOptions[i].DisplayText;
            }
        }
    }

    $scope.dragOver = function (ev) {
        var index = 0;
        for (var i = 0; i < ev.currentTarget.parentNode.children.length; i++) {
            if (ev.currentTarget === ev.currentTarget.parentNode.children[i]) {
                index = i;
                break;
            }
        }
        $scope.Fields[index].onDrop = true;
        $scope.$apply();
        ev.preventDefault();
    };
    $scope.dragLeave = function (ev) {
        var index = 0;
        for (var i = 0; i < ev.currentTarget.parentNode.children.length; i++) {
            if (ev.currentTarget === ev.currentTarget.parentNode.children[i]) {
                index = i;
                break;
            }
        }
        $scope.Fields[index].onDrop = false;
        $scope.$apply();
        ev.preventDefault();
    };

    $scope.drag = function (ev) {
        ev.dataTransfer.setData("Field", ev.target.id);
        var index = 0;
        for (var i = 0; i < ev.currentTarget.parentNode.children.length; i++) {
            if (ev.currentTarget === ev.currentTarget.parentNode.children[i]) {
                index = i;
                break;
            }
        }
        ev.dataTransfer.setData("StartIndex", index);
    };

    $scope.drop = function (ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("Field");
        var index = 0;
        for (var i = 0; i < ev.currentTarget.parentNode.children.length; i++) {
            if (ev.currentTarget === ev.currentTarget.parentNode.children[i]) {
                index = i;
                break;
            }
        }
        $scope.Fields[index].onDrop = false;
        if (data) {
            for (var i = 0; i < $scope.templates.length; i++) {
                if (data == $scope.templates[i].Name) {
                    $scope.Fields.splice(index + 1, 0, angular.copy($scope.templates[i]));
                }
            }
        } else {
            var startIndex = parseInt(ev.dataTransfer.getData("StartIndex"));
            $scope.Fields.splice(index, 0, $scope.Fields.splice(startIndex, 1)[0]);
        }

        $scope.$apply();
    };
    $scope.columnCute = function (field, index) {
        return field.Column || "col-md-12";
    }
    //Saving
    $scope.save = function () {
        if (!$.trim($scope.Title)) {
            $scope.Message = "请输入这个表单的名称";
            return;
        }
        Easy.Block();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: $scope.saveUrl,
            data: JSON.stringify({
                ID: $scope.ID,
                Title: $scope.Title,
                Description: $scope.Description,
                FormFields: $scope.Fields
            }),
            contentType: 'application/json; charset=utf-8',
            async: true,
            success: function (data) {
                if (data.Message) {
                    $scope.Message = data.Message;
                    $scope.$apply();
                }
                else {
                    window.location.href = '/Admin/Form';
                }
            }
        });
    }
}]);