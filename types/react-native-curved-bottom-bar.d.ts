declare module 'react-native-curved-bottom-bar/lib/commonjs/CurvedBottomBar/components/CurvedView/curvedView' {
  import { ComponentType } from 'react';
    import { ViewStyle } from 'react-native';
  export const CurvedViewComponent: ComponentType<{
    style?: ViewStyle;
    width: number;
    height: number;
    bgColor: string;
    path: string;
    borderColor?: string;
    borderWidth?: number;
  }>;
  export default CurvedViewComponent;
}
