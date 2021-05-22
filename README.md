# What is that?

Engine for creating forms with business-logic based on Observable pattern

# Status
> This is a _proof-of-concept_ `form engine`, based on several conceptions and ideas. It should not be used as a production-ready framework. 

# Conceptions
- `Dependency Injection` pattern is used but there is no need for `IoC container` (yet)
- A provider is a reusable singletone of a logic that has its own dependencies
- Provider\`s state should be used in a `read-only` manner by other providers (and other parts of a program)
- Instead of a big `all-in-one-data-key-value-store` a `provider-atom` is used to make all the providers as modular as possible
- Provider incapsulates all the logic and state changes inside itself and provides public methods to other parts of the program
- View elements should be as stupid as possible, putting all the useful work to a provider
- The correct way to listen to the changes occuring is a `Reactive Programming` paradigm. `EventEmitter-based feature providers` are considered _harmful_ - `rxjs` is used instead

# Development
```
yarn 
yarn storybook
```

## Architecture
### Layers TODO
```
View:  Field   <   FieldStructure   <   StepStructure
```

## Next iterations
- Split to different packages
- Add showcase for `application-sending` provider
- Fix bad and too wide typings (add generics)
