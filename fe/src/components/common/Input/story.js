import React from 'react';
import { storiesOf, action } from '@storybook/react';

import Input from './Input';

storiesOf('Input').addWithInfo(
  'Normal',
  '',
  () => (
    <div style={{ width: '300px' }}>
      <Input onChange={action('onChange')} placeholder="placeholder" />

      <Input
        onChange={action('onChange')}
        placeholder="placeholder"
        value="Text .... "
      />

    </div>
  ),
  { source: true, inline: true },
);