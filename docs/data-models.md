# MacroData
```typescript
export interface IMacroData {
  uuid?: string;
  customContentId?: string;
  updatedAt?: Date;
}
```

Note that we do not store the content property key. It is a calculated value.

```typescript
  propertyKey(uuid: string) {
    const macroKey = `zenuml-${this._macroIdentifier}-macro`;
    return `${macroKey}-${uuid}-body`;
  }
```


# MacroBody

# CustomContent

# ContentProperty
Between 01/01/2022 ~ 20/07/2022, there 19 sessions saving content as content property. In comparison,
there are 5000 sessions saving as custom_content and 4600 also saved to macro body. Saving to content
property is only accountable for ~0.4% of all saving sessions. Between 01/03/2022 and 19/07/2022, it
is accountable for ~0.2% (3 clients used it out 30 clients that have saved macro).

So we should disable this feature and remove saving logic for content property. By disabling it, we
mean disable editing from dialog. There is no error.

[]: # Language: markdown
[]: # Path: docs/data-models.md