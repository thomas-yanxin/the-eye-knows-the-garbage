import * as React from 'react';
declare type MotionFunc = (element: HTMLElement) => React.CSSProperties;
declare type MotionEndFunc = (element: HTMLElement, event: TransitionEvent) => boolean;
interface Motion {
    visible?: boolean;
    motionName?: string;
    motionAppear?: boolean;
    motionEnter?: boolean;
    motionLeave?: boolean;
    motionLeaveImmediately?: boolean;
    motionDeadline?: number;
    removeOnLeave?: boolean;
    leavedClassName?: string;
    onAppearStart?: MotionFunc;
    onAppearActive?: MotionFunc;
    onAppearEnd?: MotionEndFunc;
    onEnterStart?: MotionFunc;
    onEnterActive?: MotionFunc;
    onEnterEnd?: MotionEndFunc;
    onLeaveStart?: MotionFunc;
    onLeaveActive?: MotionFunc;
    onLeaveEnd?: MotionEndFunc;
}
declare const collapseMotion: Motion;
export default collapseMotion;
