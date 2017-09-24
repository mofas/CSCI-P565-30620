import React from 'react';
import { storiesOf, action } from '@storybook/react';

import Btn from './Btn';

storiesOf('Btn')
  .addWithInfo(
    'Default',
    '',
    () => (
      <div style={{ display: 'flex' }}>
        <Btn>Btn</Btn>
        <Btn type="secondary">Btn</Btn>
      </div>
    ),
    { source: true, inline: true },
  )
  .addWithInfo(
    'Text: Save',
    '',
    () => (
      <div style={{ display: 'flex' }}>
        <Btn>Save</Btn>
        <Btn type="secondary">Save</Btn>
      </div>
    ),
    { source: true, inline: true },
  )
  .addWithInfo(
    'Event',
    '',
    () => (
      <div style={{ display: 'flex' }}>
        <Btn onClick={action('click')}>Save</Btn>
        <Btn onClick={action('click')} type="secondary">Save</Btn>
      </div>
    ),
    { source: true, inline: true },
  )
  .addWithInfo(
    'Disabled',
    '',
    () => (
      <div style={{ display: 'flex' }}>
        <Btn disabled onClick={action('click')}>Disabled</Btn>
        <Btn disabled onClick={action('click')} type="secondary">Disabled</Btn>
      </div>
    ),
    { source: true, inline: true },
  );
