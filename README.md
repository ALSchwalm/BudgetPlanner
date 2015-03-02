BudgetPlanner
=============

An application to assist with creating budgets at HPC2.

Extending The Interface
=======================

Widget
------

The items in the interface all use the Widget type as their prototype. The Widget
constructor takes a string representing the name of the widget, and a type to be
constructed to create a line item in that section of the budget. Widget subclass
constructors will be passed an element to fill with their contents, and should
invoke `init` using this element as the first step in their constructor. For example,
`EquipmentWidget` defines the following constructor and prototype:

    var EquipmentWidget = function(elem) {
        this.init(elem);
    }

    EquipmentWidget.prototype = new Widget("Equipment", EquipmentItem);

Type using `Widget` as a prototype are also required to provide the following
methods:

- `serialize()`: Returns a nested array of values suitable for being passed to excel-builder. See [this link](http://excelbuilderjs.com/) for more information.
- `restore(config)`: Restore this widget to the state specified by the configuration
- `save()`: Return a configuration object suitable for being passed to `restore`.

Item
----

`EquipmentItem` is an example of an Item type. These types are required to have the
following methods:

- `update()`: Bring this item up-to-date. Returns nothing.
- `val()`: Must return an array of values representing the cost of this item at each year in the budget
- `addYear()`: Modify the item to support input for an additional year. Returns nothing
- `removeYear()`: Remove support for the last year. Returns nothing.
- `serialize()`: Returns an array of values suitable for being passed to excel-builder. See [this link](http://excelbuilderjs.com/) for more information.
- `restore(config)`: Restore this item to the state specified by the configuration
- `save()`: Return a configuration object suitable for being passed to `restore`.

The Item constructor will be invoked with an element to fill with the Item's body,
a reference to the parent widget, the number of years represented by the current
budget, and an optional configuration object.

TODO
====

- [ ] Salary And Wages
- [ ] Fringe Benefits
- [ ] Contracts
- [ ] Supplies
- [ ] Equipment
- [ ] Travel
- [ ] Subcontract
- [ ] Total Modified/Direct cost
