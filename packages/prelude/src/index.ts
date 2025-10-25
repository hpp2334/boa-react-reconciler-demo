import * as React from "react";
import * as ReactReconciler from "react-reconciler";

export function prelude() {
    const g = globalThis as any

    g.React = React;
    g.ReactReconciler = ReactReconciler;
}
