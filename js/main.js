(function() {
  var App, Column, Condition, columnTypes, dataArr, defaultColumns, emptyCondition, operatorDefinitions;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  defaultColumns = {
    "FirstName": "varchar",
    "EmployeeCount": "int",
    "LastUpdated": "datetime",
    "Active": "bit"
  };

  columnTypes = {
    int: {
      "Contains Data": [],
      "Does Not Contain Data": [],
      "Equal To": [""],
      "Greater Than": [""],
      "Greater Than or Equal To": [""],
      "Less Than": [""],
      "Less Than or Equal To": [""],
      "Not Equal To": [""]
    },
    varchar: {
      "Contains": [""],
      "Contains Data": [],
      "Does Not Contain Data": [],
      "Ends With": [""],
      "Equal To": [""],
      "Greater Than": [""],
      "Greater Than or Equal To": [""],
      "Less Than": [""],
      "Less Than or Equal To": [""],
      "Not Equal To": [""],
      "Starts With": [""]
    },
    datetime: {
      "After Next [Days]": [""],
      "Contains Data": [],
      "Days Equal": [""],
      "Does Not Contain Data": [],
      "Equal To": ["", "Today"],
      "Months Equals [number]": [""],
      "Not Equal To": [""],
      "Older than [days]": [""],
      "On or After": ["", "Today"],
      "On or Before": ["", "Today"],
      "Within Last [days]": [""],
      "Within Next [days]": [""],
      "Years Equals [number]": [""]
    },
    bit: {
      "Equal To": ["True", "False"]
    }
  };

  operatorDefinitions = {
    "After Next [Days]": function() {
      return " DateAdd(d," + this.getComparison()() + "," + this.getColumnName()() + " ) > GetDate() ";
    },
    "Contains Data": function() {
      return " != '' OR IS NOT NULL  ";
    },
    "Days Equal": function() {
      return " DAY( " + this.getColumnName()() + " ) = ";
    },
    "Does Not Contain Data": function() {
      return " = '' OR IS NULL ";
    },
    "Equal To": function() {
      return " = " + this.getFormattedComparison();
    },
    "Months Equals [number]": function() {
      return " MONTH( " + this.getColumnName()() + " ) = ";
    },
    "Not Equal To": function() {
      return " != " + this.getFormattedComparison();
    },
    "Older than [days]": function() {
      return "";
    },
    "On or After": function() {
      return "";
    },
    "On or Before": function() {
      return "";
    },
    "Within Last [days]": function() {
      return "";
    },
    "Within Next [days]": function() {
      return "";
    },
    "Years Equals [number]": function() {
      return " YEAR( " + this.getColumnName()() + " ) = YEAR( " + this.getComparison()() + " )";
    },
    "Starts With": function() {
      return " LIKE '" + this.getComparison()() + "%' ";
    },
    "Contains": function() {
      return " LIKE '%" + this.getComparison()() + "%' ";
    },
    "Ends With": function() {
      return " LIKE '%" + this.getComparison()() + "' ";
    },
    "Greater Than": function() {
      return " > " + this.getComparison()();
    },
    "Less Than": function() {
      return " < " + this.getComparison()();
    },
    "Greater Than or Equal To": function() {
      return " => " + this.getComparison()();
    },
    "Less Than or Equal To": function() {
      return " =< " + this.getComparison()();
    }
  };

  String.prototype.singleQuoted = function() {
    return "'" + this + "'";
  };

  Condition = (function() {

    function Condition(params) {
      this.getOpAndComp = __bind(this.getOpAndComp, this);      this.ID = params['ID'] || 0;
      this.startParen = ko.observable(params['('] || "");
      this['('] = params['('];
      this.columnName = ko.observable(params['Column'] || "");
      this.Column = params['Column'];
      this.operator = ko.observable(params['Operator'] || "");
      this.Operator = params['Operator'];
      this.comparison = ko.observable(params['Comparison'] || "");
      this.Comparison = params['Comparison'];
      this.endParen = ko.observable(params[')'] || "");
      this[')'] = params[')'];
      this.seperator = ko.observable(params['Seperator'] || "");
      this.Seperator = params['Seperator'];
      this.Statement = this.toString();
    }

    Condition.prototype.setStartParen = function(parens) {
      return this.startParen(parens);
    };

    Condition.prototype.setColumnName = function(name) {
      return this.columnName(name);
    };

    Condition.prototype.setOperator = function(symbol) {
      return this.operator(symbol);
    };

    Condition.prototype.setComparison = function(value) {
      return this.comparison(value);
    };

    Condition.prototype.setEndParen = function(parens) {
      return this.endParen(parens);
    };

    Condition.prototype.setSeperator = function(bool) {
      return this.seperator(bool);
    };

    Condition.prototype.getStartParen = function() {
      return this.startParen;
    };

    Condition.prototype.getColumnName = function() {
      return this.columnName;
    };

    Condition.prototype.getOperator = function() {
      return this.operator;
    };

    Condition.prototype.getOperators = function() {
      var operator, _results;
      _results = [];
      for (operator in columnTypes[this.getDataType()]) {
        _results.push(operator);
      }
      return _results;
    };

    Condition.prototype.getComparison = function() {
      return this.comparison;
    };

    Condition.prototype.getFormattedComparison = function() {
      var x;
      x = null;
      if (this.getDataType() === 'varchar') {
        x = this.comparison().singleQuoted();
      } else if (this.getDataType() === 'bit') {
        if (this.comparison() === "True") {
          x = 1;
        } else {
          x = 0;
        }
      } else {
        x = this.comparison();
      }
      return x;
    };

    Condition.prototype.getComparisons = function() {
      return columnTypes[this.getDataType()][this.getOperator()()];
    };

    Condition.prototype.showPresetComparisons = function() {
      return this.getComparisons().length > 0;
    };

    Condition.prototype.showCustomComparisons = function() {
      return this.getComparisons().indexOf("") > -1;
    };

    Condition.prototype.getEndParen = function() {
      return this.endParen;
    };

    Condition.prototype.getSeperator = function() {
      return this.seperator();
    };

    Condition.prototype.getDataType = function() {
      return defaultColumns[this.columnName()];
    };

    Condition.prototype.getOpAndComp = function() {
      return operatorDefinitions[this.operator()].apply(this);
    };

    Condition.prototype.toString = function() {
      return " " + (this.startParen()) + " " + (this.columnName()) + " " + (this.getOpAndComp()) + " " + (this.endParen()) + " " + (this.getSeperator()) + " ";
    };

    return Condition;

  })();

  Column = (function() {

    function Column(name, type) {
      this.getTypes = __bind(this.getTypes, this);      this.viewName = ko.observable(name);
      this.dataType = ko.observable(type);
    }

    Column.prototype.getViewName = function() {
      return this.viewName;
    };

    Column.prototype.toString = function() {
      return this.viewName() + ":" + this.viewName();
    };

    Column.prototype.getTypes = function() {
      var operator, _results;
      _results = [];
      for (operator in columnTypes[this.dataType()]) {
        _results.push(operator);
      }
      return _results;
    };

    return Column;

  })();

  App = (function() {

    function App() {
      this.selectCondition = __bind(this.selectCondition, this);
      this.operatorTemplate = __bind(this.operatorTemplate, this);
      this.addPlaceholder = __bind(this.addPlaceholder, this);
      var n, t;
      this.conditions = ko.observableArray(dataArr);
      this.columns = ko.observableArray((function() {
        var _results;
        _results = [];
        for (n in defaultColumns) {
          t = defaultColumns[n];
          _results.push(new Column(n, t));
        }
        return _results;
      })());
      this.selectedCondition = ko.mapping.fromJS(emptyCondition);
    }

    App.prototype.getConditions = function() {
      return this.conditions;
    };

    App.prototype.getColumns = function() {
      return this.columns;
    };

    App.prototype.getGridColumns = function() {
      return this.columns().join(";");
    };

    App.prototype.viewStatement = function() {
      return this.conditions().join("");
    };

    App.prototype.addPlaceholder = function() {
      return this.conditions.push(new Condition("(", "FirstName", "Equal To", "richard", ")"));
    };

    App.prototype.operatorTemplate = function() {
      return '<select data-bind="value: operator">' + (this.selectedCondition.getOperators().map(function(operator) {
        return '<option>' + operator + "</option>";
      })).join("") + "</select>";
    };

    App.prototype.getActiveOperators = function(elem, operation, value) {
      if (operation === 'get') {
        return $(elem).val();
      } else if (operation === 'set') {
        return $(elem).val(value);
      }
    };

    App.prototype.selectCondition = function(selectedItem) {
      return ko.mapping.fromJS($.extend(new Condition(selectedItem), selectedItem), this.selectedCondition);
    };

    App.prototype.add = function() {
      var newId;
      if (!this.selectedCondition.ID()) {
        newId = this.conditions().length + 1;
        this.selectedCondition.ID(newId);
        this.conditions.push(ko.mapping.toJS(this.selectedCondition));
      }
      return ko.mapping.fromJS(emptyCondition, this.selectedCondition);
    };

    return App;

  })();

  emptyCondition = {
    "ID": null,
    "(": null,
    "Column": "",
    "Operator": null,
    "Value": null,
    ")": null,
    "Seperator": null,
    "Statement": null
  };

  dataArr = [
    new Condition({
      "ID": 1,
      "(": "(",
      "Column": "FirstName",
      "Operator": "Equal To",
      "Value": "richard",
      ")": ")",
      "Seperator": "OR",
      "Statement": ""
    }), new Condition({
      "ID": 2,
      "(": "(",
      "Column": "Active",
      "Operator": "Equal To",
      "Value": "1",
      ")": ")",
      "Seperator": "",
      "Statement": ""
    })
  ];

  $(function() {
    window["Main"] = new App();
    return ko.applyBindings(Main);
  });

}).call(this);
