import React, { Children, ReactElement, useState } from "react";
import type {
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

// --- Cores (ajuste conforme seu tema) ---
const colors = {
  // Primário (Default Button)
  primary: "hsl(222.2, 47.4%, 11.2%)",
  primaryForeground: "hsl(210, 40%, 98%)",
  primaryHover: "hsl(222.2, 47.4%, 20.2%)",

  // Destrutivo
  destructive: "hsl(0, 84.2%, 60.2%)",
  destructiveForeground: "hsl(0, 0%, 98%)",
  destructiveHover: "hsl(0, 84.2%, 70.2%)",

  // Outline
  outlineBorder: "hsl(214.3, 31.8%, 91.4%)",
  outlineBackground: "transparent",
  outlineHoverBackground: "hsl(215, 20.2%, 96.1%)",
  outlineHoverText: "hsl(222.2, 47.4%, 11.2%)",

  // Secundário
  secondary: "hsl(210, 40%, 96.1%)",
  secondaryForeground: "hsl(222.2, 47.4%, 11.2%)",
  secondaryHover: "hsl(210, 40%, 92.1%)",

  // Ghost
  ghostHoverBackground: "hsl(210, 40%, 96.1%)",
  ghostHoverText: "hsl(222.2, 47.4%, 11.2%)",

  // Link
  linkText: "hsl(222.2, 47.4%, 11.2%)",

  // Outros
  textDefault: "hsl(222.2, 47.4%, 11.2%)",
  ringColorFocus: "hsl(214.3, 31.8%, 91.4%)", // Usado para borda/sombra de foco
  disabledOpacity: 0.5,
  shadowColor: "rgba(0, 0, 0, 0.1)",
};

// --- Estilos Base ---
const baseStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    includeFontPadding: false,
  },
  buttonShrink: {
    flexShrink: 0,
  },
  focusedState: {
    ...Platform.select({
      ios: {
        shadowColor: colors.ringColorFocus,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
      },
      android: {
        // Para Android, uma borda mais proeminente ou um elevation diferente
        // borderColor: colors.ringColorFocus, // Exemplo
        // borderWidth: 1.5, // Exemplo
      },
    }),
  },
  shadowXs: {
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

// --- Definições de Variantes (Container e Texto) ---
type ButtonVariantStyleFn = (
  pressed: boolean,
  focused: boolean
) => {
  container?: ViewStyle;
  text?: TextStyle;
};

const variants: Record<string, ButtonVariantStyleFn> = {
  default: (pressed, focused) => ({
    container: {
      backgroundColor: pressed ? colors.primaryHover : colors.primary,
      ...(focused ? baseStyles.focusedState : {}),
      ...baseStyles.shadowXs,
    },
    text: {
      color: colors.primaryForeground,
    },
  }),
  destructive: (pressed, focused) => ({
    container: {
      backgroundColor: pressed ? colors.destructiveHover : colors.destructive,
      ...(focused ? baseStyles.focusedState : {}), // Idealmente, ring vermelho para destructive
      ...baseStyles.shadowXs,
    },
    text: {
      color: colors.destructiveForeground,
    },
  }),
  outline: (pressed, focused) => ({
    container: {
      borderColor: focused ? colors.ringColorFocus : colors.outlineBorder,
      backgroundColor: pressed
        ? colors.outlineHoverBackground
        : colors.outlineBackground,
      ...(focused ? baseStyles.focusedState : {}),
      ...baseStyles.shadowXs,
    },
    text: {
      color: pressed ? colors.outlineHoverText : colors.textDefault,
    },
  }),
  secondary: (pressed, focused) => ({
    container: {
      backgroundColor: pressed ? colors.secondaryHover : colors.secondary,
      ...(focused ? baseStyles.focusedState : {}),
      ...baseStyles.shadowXs,
    },
    text: {
      color: colors.secondaryForeground,
    },
  }),
  ghost: (pressed, focused) => ({
    container: {
      backgroundColor: pressed ? colors.ghostHoverBackground : "transparent",
      borderColor: "transparent",
      ...(focused ? baseStyles.focusedState : {}),
    },
    text: {
      color: pressed ? colors.ghostHoverText : colors.textDefault,
    },
  }),
  link: (pressed, focused) => ({
    container: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      height: undefined,
      borderWidth: 0,
      ...(focused && !pressed
        ? { backgroundColor: colors.ghostHoverBackground, borderRadius: 3 }
        : {}),
    },
    text: {
      color: colors.linkText,
      textDecorationLine: pressed ? "underline" : "none",
    },
  }),
};

// --- Definições de Tamanho ---
interface ButtonSizeStyle {
  container: ViewStyle; // paddingHorizontal aqui será o base
  text: TextStyle;
  iconSize: number;
  iconPaddingAdjustment?: number; // Quanto subtrair do paddingHorizontal base se houver ícone
}

const sizes: Record<string, ButtonSizeStyle> = {
  default: {
    container: {
      height: 38,
      paddingHorizontal: 16,
      gap: 8,
    },
    text: { fontSize: 14 },
    iconSize: 16,
    iconPaddingAdjustment: 4,
  },
  sm: {
    container: {
      height: 34,
      borderRadius: 6,
      paddingHorizontal: 12,
      gap: 6,
    },
    text: { fontSize: 13 },
    iconSize: 14,
    iconPaddingAdjustment: 2,
  },
  lg: {
    container: {
      height: 42,
      borderRadius: 6,
      paddingHorizontal: 24,
      gap: 10,
    },
    text: { fontSize: 15 },
    iconSize: 18,
    iconPaddingAdjustment: 8,
  },
  icon: {
    container: {
      height: 38,
      width: 38,
      paddingHorizontal: 0,
      alignItems: "center",
      justifyContent: "center",
      gap: 0,
    },
    text: { fontSize: 0 },
    iconSize: 20,
    // iconPaddingAdjustment não se aplica a 'icon' size
  },
};

// --- Props do Componente ---
export interface ButtonProps extends PressableProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  isLoading?: boolean;
  loadingText?: string;
}

// --- Componente Button ---
const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  children,
  style: customContainerStyle,
  textStyle: customTextStyle,
  disabled: propDisabled,
  leftIcon,
  rightIcon,
  isLoading = false,
  loadingText = "Carregando...",
  onPress,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isDisabled = propDisabled || isLoading;

  const currentVariantStyleFn = variants[variant];
  const currentSizeStyle = sizes[size];

  // --- CORREÇÃO 1 APLICADA AQUI ---
  const hasIcon = !!(leftIcon || rightIcon);
  let numericBasePaddingHorizontal: number;

  if (typeof currentSizeStyle.container.paddingHorizontal === "number") {
    numericBasePaddingHorizontal = currentSizeStyle.container.paddingHorizontal;
  } else {
    numericBasePaddingHorizontal = 0; // Fallback
    if (__DEV__) {
      console.warn(
        `Button: paddingHorizontal for size '${size}' is not a number. Defaulting to 0.`
      );
    }
  }

  let actualPaddingHorizontal: number = numericBasePaddingHorizontal;

  if (
    hasIcon &&
    size !== "icon" && // Não ajustar para botões 'icon' puros
    typeof currentSizeStyle.iconPaddingAdjustment === "number"
  ) {
    actualPaddingHorizontal =
      numericBasePaddingHorizontal - currentSizeStyle.iconPaddingAdjustment;
  }
  // --- FIM DA CORREÇÃO 1 ---

  const renderIcon = (
    iconElement: ReactElement | undefined,
    iconColor: string
  ) => {
    if (!iconElement) return null;

    const iconOriginalProps = iconElement.props as {
      style?: StyleProp<ViewStyle>;
      [key: string]: any; // Permite outras props originais
    };
    const existingIconStyle = iconOriginalProps?.style;

    // Define uma interface para as props que estamos injetando/sobrescrevendo.
    // Isso ajuda a tornar a asserção de tipo mais clara.
    interface InjectedIconProps {
      color?: string;
      size?: number;
      style?: StyleProp<ViewStyle>;
      // Se você precisar garantir que outras props originais não sejam perdidas
      // na verificação de tipo (embora cloneElement as preserve por padrão),
      // você poderia adicionar [key: string]: any; aqui também.
    }

    try {
      // Fazemos uma asserção de tipo no `iconElement` para informar ao `cloneElement`
      // que este elemento é compatível com as InjectedIconProps.
      return React.cloneElement(
        iconElement as React.ReactElement<InjectedIconProps>, // Asserção de tipo aqui
        {
          color: iconColor,
          size: currentSizeStyle.iconSize,
          style: [{ flexShrink: 0 }, existingIconStyle].filter(Boolean),
        }
      );
    } catch (error) {
      if (__DEV__) {
        console.warn("Button: Couldn't clone icon:", error, iconElement);
      }
      return iconElement; // Retorna o original se clonagem falhar
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        baseStyles.container,
        baseStyles.buttonShrink,
        currentVariantStyleFn(pressed, isFocused).container,
        {
          // Aplica estilos de tamanho, incluindo o padding horizontal ajustado
          ...currentSizeStyle.container,
          paddingHorizontal: actualPaddingHorizontal,
        },
        isDisabled && { opacity: colors.disabledOpacity },
        customContainerStyle,
      ]}
      disabled={isDisabled}
      onPress={isLoading ? undefined : onPress}
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      {...props}
    >
      {({ pressed }) => {
        const dynamicVariantStyles = currentVariantStyleFn(pressed, isFocused);
        const textColor =
          (dynamicVariantStyles.text?.color as string) || colors.textDefault;

        return (
          <>
            {isLoading ? (
              <>
                <ActivityIndicator
                  size="small"
                  color={textColor}
                  style={{
                    marginRight: loadingText
                      ? Number(currentSizeStyle.container.gap) || 0
                      : 0,
                  }}
                />
                {loadingText && (
                  <Text
                    style={[
                      baseStyles.text,
                      dynamicVariantStyles.text,
                      currentSizeStyle.text,
                      customTextStyle,
                    ]}
                  >
                    {loadingText}
                  </Text>
                )}
              </>
            ) : (
              <>
                {leftIcon && renderIcon(leftIcon, textColor)}
                {Children.map(children, (child) => {
                  if (typeof child === "string" || typeof child === "number") {
                    return (
                      <Text
                        style={[
                          baseStyles.text,
                          dynamicVariantStyles.text,
                          currentSizeStyle.text,
                          variant === "link" && {
                            textDecorationLine: pressed ? "underline" : "none",
                          },
                          customTextStyle,
                        ]}
                      >
                        {child}
                      </Text>
                    );
                  }
                  return child;
                })}
                {rightIcon && renderIcon(rightIcon, textColor)}
              </>
            )}
          </>
        );
      }}
    </Pressable>
  );
};

export { Button };
