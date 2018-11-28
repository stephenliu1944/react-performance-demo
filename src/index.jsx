import './styles/main';
import React from 'react';
import { render } from 'react-dom';
import Grid from './containers/grid/Grid';
import 'core-js/fn/promise';

if (__DEV__) {
    import('react-addons-perf').then((Perf) => {
        Perf.start();
        window.Perf = Perf;
    });
}

render(
    <Grid />,
    document.getElementById('app')
);

