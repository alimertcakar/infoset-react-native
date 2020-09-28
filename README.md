[![npm version](https://badge.fury.io/js/%40infoset%2Freact-native.svg)](https://badge.fury.io/js/%40infoset%2Freact-native)

<img src="https://user-images.githubusercontent.com/13895224/94475996-8de39c80-01d8-11eb-8771-e590b33c612e.png" alt="Infoset" width="300" />

# @infoset/react-native

Infoset react-native SDK allows you to integrate Infoset Chat with your react-native app.

## Setup

This library is available on npm, install it with: `npm i @infoset/react-native react-native-webview@8.0.0` or `yarn add @infoset/react-native react-native-webview@8.0.0`.

### Usage
1.  Import @infoset/react-native:

```javascript
import { ChatWidget } from '@infoset/react-native';
```

2.  Simply

```javascript
function ExampleComponent() {
  return (
    <ChatWidget />
  )
}
```

3.  Then simply show it by setting the `isVisible` prop to true:

```javascript
function ExampleComponent() {
  return (
    <ChatWidget
      isVisible={true}
      ...
    />
  )
}
```

The `isVisible` prop is the only prop you'll really need to make the modal work: you should control this prop value by saving it in your state and setting it to `true` or `false` when needed.<br/>
`apiKey` is required.<br/>
At least one of `iosKey` or `androidKey` is required. You are free to enter both of them also. Otherwise, widget will not work.

### Assign chat to tags

You can route your chats to specific tags by providing `tags`.

```javascript
<ChatWidget
  ...
  tags={['Support', 'Recurring Customer']}
/>
```

### Setting User Variables

You can provide your user's details such as name and email if they are known, so you will immediately know who you are talking to on the Infoset dashboard:

```javascript
<ChatWidget
  ...
  user={{
    id: 123,
    email: 'example@infoset.app',
    firstName: 'John',
    lastName: 'Doe',
    ...
  }}
/>
```

user type
```javascript
export type UserType = {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  userHash?: string;
  createdAt?: string;
  company?: string;
};
```

See `examples/src/app.tsx` for all of the user fields.

### Handling URLs

By default, all links in chat messages are opened in default browser. To change this behavior you can use the `handleUrls` to handle URLs yourself.

```javascript
<ChatWidget
  ...
  handleUrls={(url) => console.log(`URL is ${url}`}
/>
```

See example app from `/examples` for complete example.

### Available props
-- Widget
| Name                           | Type             | Default                        |Description                                                     |
| ------------------------------ | ---------------- | ------------------------------ | -------------------------------------------------------------- |
| isVisible                      | bool             | **REQUIRED** / false           | Show / hide the widget                                         |
| apiKey                         | string           | **REQUIRED**                   | Infoset API key                                                |
| iosKey                         | string           | undefined                      | IOS key given from Infoset                                     |
| androidKey                     | string           | undefined                      | Android key given from Infoset                                 |
| color                          | string           | '#fff'                         | Widget color                                                   |
| onWidgetWillShow               | func             | () => void                     | Called before the widget show animation begins                 |
| onWidgetShow                   | func             | () => void                     | Called when the widget is completely visible                   |
| onWidgetWillHide               | func             | () => void                     | Called before the widget hide animation begins                 |
| onWidgetHide                   | func             | () => void                     | Called when the widget is completely hiden                     |
| onNewMessage                   | func             | () => void                     | Called when the new message received                           |
| handleUrls                     | func             | (url: string) => void          | Called when a link clicked                                     |
| user                           | object           | undefined                      | User data                                                   |
| tags                           | array            | undefined                      | Tags                                                           |
