var Foo = {

    variables: [
        {name: "x", callback: this.funX},
        {name: "y", callback: this.funY},
        {name: "z", callback: this.funZ}
    ],


    //For this example, data could be the following object
    // data = {x: 0, y: 1, z: 0};
    bar: function(data) {
    	var self = this;


        this.variables.forEach(function(elem) {
        	console.log(arguments, self);
            // if(data[elem.name] == 1)
            //     elem.callback();
        });

    },

    funX: function() {
        console.log(this.variables[0].name);
    },

    funY: function() {
        console.log(this.variables[1].name);
    },

    funZ: function() {
        console.log(this.variables[2].name);
    }
}
