import * as React from "react";
import ReactReconciler from "react-reconciler";

export function setup() {
    const g = globalThis as any

    g.React = React;
    g.ReactReconciler = ReactReconciler;
}
