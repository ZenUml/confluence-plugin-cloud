
## stopPropagation (reads don't bubble up)
The `stopPropagation()` method of the Event interface prevents further propagation of the current event in the capturing and bubbling phases.

## stopImmediatePropagation (reads stop sibling listeners)
The stopImmediatePropagation() method of the Event interface prevents other listeners of the same event from being called.

If several listeners are attached to the same element for the same event type, they are called in the order in which they were added. If stopImmediatePropagation() is invoked during one such call, no remaining listeners will be called.

## preventDefault (reads don't respond)

The `preventDefault()` method of the Event interface tells the user agent that if the event does not get explicitly handled, its default action should not be taken as it normally would be. For example, toggling a checkbox is the default action of clicking on a checkbox. `preventDefault()` can be used to block that behaviour.

