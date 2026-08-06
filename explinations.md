# Explanations for some terms in nest.js

## Modules in nest.js

    ### Class annotated with the @module() decorator and this decorator provide nest.js with some meta data that allow nest to organization and manage the project structure efficiently.

    all have to end up at the app.module vi direct call and added to the imports module or vi submodule
    Module-B  --> Module-A ---> AppModule
     Module-A ---> AppModule and the nest application have at least one module where its located at the root of the app and used to build the application  graph

     The @Module decorator accept single {} that include few things / arrays
        Providers --> The providers will be instantiated by nest to be available to be used by the other parts and manly injected by the nest injector (shard on the module parts unless its exports and be imported by other modules ).

        controllers --> set of controllers will be instantiated by teh nest  for the module.( even if you have your controller in place with not listed here it will be blinded on the app and no http request could get into it )

        imports --> the list of imported providers from the other modules to be used by this module

        exports --> the subset of provided will be exported by this module to be used by other modules


providers get @Injectable add to the class metadata that could telling nest.js as this class could be managed by IOC ()