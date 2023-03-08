import React, { FC } from 'react';
import styled from 'styled-components';
import { MoreHorizontal } from 'react-feather';

export interface PopoverProps {
  content: React.ReactNode | string;
  triger?: React.ReactNode | string;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  placement?: 'bottomLeft' | 'bottomRight' | 'bottom';
}

const DefaultTriggerNode = () => {
  const DefaultTriggerWrapper = styled.div`
    font-size: 0;
    .moreOperationIcon {
      max-width: 19px;
      max-height: 19px;
      cursor: pointer;
      position: relative;
    }
  `;
  return (
    <DefaultTriggerWrapper>
      <MoreHorizontal className="moreOperationIcon" />
    </DefaultTriggerWrapper>
  );
};

const Popover: FC<PopoverProps> = ({
  triger,
  placement = 'bottomLeft',
  style,
  content,
  contentStyle,
}) => {
  return (
    <DropdownWrapper style={style}>
      <div className="triggerWrapper">{triger || <DefaultTriggerNode />}</div>
      <div className={`menuWrapper ${placement}`} style={contentStyle}>
        {content}
      </div>
    </DropdownWrapper>
  );
};
const DropdownWrapper = styled.div`
  position: relative;
  &:hover > .menuWrapper {
    opacity: 1;
    transform: scale(1);
    &.bottom {
      transform: scale(1) translateX(-50%);
    }
  }
  .menuWrapper {
    position: absolute;
    white-space: nowrap;
    z-index: 9999;
    opacity: 0;
    transition: all ease 0.6s;
    padding: 6px 5px;
    transform: scale(0);
    background: #191919;
    border-radius: 8px;
    box-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%),
      0 9px 28px 8px rgb(0 0 0 / 5%);
    &.bottomLeft {
      top: 100%;
      left: 0;
      transform-origin: 0 0;
    }
    &.bottomRight {
      top: 100%;
      right: 0;
      transform-origin: 100% 0;
    }
    &.bottom {
      top: 100%;
      transform-origin: 50% 0;
      transform: scaleY(0) translateX(-50%);
      margin-left: 50%;
      //transform: translateX(-50%);
    }
  }
`;
export default Popover;
