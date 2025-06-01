import React, { useState } from "react";
import type {
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Platform, StyleSheet, TextInput } from "react-native";

// Definindo algumas cores base (você pode ajustar conforme seu tema)
const colors = {
  foreground: "#09090B", // Cor do texto principal (slate-900)
  mutedForeground: "#71717A", // Cor do placeholder (slate-500)
  primary: "#3B82F6", // Azul primário (blue-500) - para seleção e foco
  primaryForeground: "#FFFFFF", // Texto sobre o primário (branco)
  inputBackground: "transparent", // Fundo do input (transparente por padrão)
  // darkInputBackground: 'rgba(55, 65, 81, 0.3)', // Ex: bg-input/30 (gray-700 com opacidade) - para dark mode
  borderColor: "#E4E4E7", // Cor da borda (slate-200 ou zinc-200)
  ringColor: "#3B82F6", // Cor do anel de foco (blue-500)
  destructiveColor: "#EF4444", // Cor para erro (red-500)
  disabledOpacity: 0.5,
};

interface CustomInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  isInvalid?: boolean;
  // Adicione outras props que você possa precisar, como `leftIcon`, `rightIcon`, etc.
}

const Input: React.FC<CustomInputProps> = ({
  style, // Renomeado de className para style, comum no React Native
  isInvalid = false,
  editable = true,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const baseInputStyle = [
    styles.base,
    isInvalid && styles.invalid,
    isFocused && styles.focused,
    !editable && styles.disabled,
    style, // Permite sobrescrever estilos externamente
  ];

  return (
    <TextInput
      style={baseInputStyle}
      placeholderTextColor={colors.mutedForeground}
      selectionColor={colors.primary} // Cor da seleção de texto
      onFocus={(e) => {
        handleFocus();
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        handleBlur();
        props.onBlur?.(e);
      }}
      editable={editable}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    height: 40, // Shadcn h-9 é 36px, h-10 é 40px. 40px é mais comum em mobile.
    width: "100%",
    minWidth: 0,
    borderRadius: 6, // rounded-md
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 12, // px-3
    paddingVertical: 8, // py-1 (ajustado para altura de 40)
    fontSize: 14, // text-sm (md:text-sm), text-base (16px) pode ser um pouco grande para mobile
    color: colors.foreground,
    // Shadow (shadow-xs) - Mais complexo no RN e dependente da plataforma
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.05)",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1, // Uma elevação sutil
      },
    }),
    // transition-[color,box-shadow] - Transições são feitas via Animated API no RN
    // outline-none - Não aplicável diretamente
  },
  focused: {
    borderColor: colors.ringColor,
    // Para simular o "ring-[3px]":
    // Pode-se aumentar o borderWidth ou usar um View em volta com borda,
    // mas para simplicidade, apenas a cor da borda é alterada.
    // Se precisar de um anel mais proeminente:
    // borderWidth: 1.5, // Ou 2
    // Ou para um efeito de "box-shadow" no foco:
    ...Platform.select({
      ios: {
        shadowColor: "rgba(59, 130, 246, 0.5)", // ring-ring/50
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 3, // ring-[3px]
      },
      android: {
        // Android não suporta box-shadow da mesma forma,
        // o elevation pode ser aumentado ou usar bordas
        elevation: 3,
      },
    }),
  },
  invalid: {
    borderColor: colors.destructiveColor,
    // Para o "ring" do estado inválido (aria-invalid:ring-destructive/20)
    // Pode-se adicionar um shadow sutil vermelho se desejado
    ...Platform.select({
      ios: {
        shadowColor: "rgba(239, 68, 68, 0.2)", // destructiveColor com opacidade
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        // Poderia ter um elevation sutil com cor de fundo se o TextInput estivesse em um View
      },
    }),
  },
  disabled: {
    opacity: colors.disabledOpacity,
    // pointer-events-none é coberto por editable={false}
    // cursor-not-allowed não é diretamente aplicável
  },
  // file: e dark: prefixed classes precisariam de lógica adicional (ex: tema)
});

export { Input };
