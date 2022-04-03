import { useInput } from "ink";
import { FC } from "react";

interface KeepFocusProps {
    disable?: boolean;
}

export const KeepFocus: FC<KeepFocusProps> = ({ disable = false }) => {
    useInput(
        () => {
            //
        },
        { isActive: !disable }
    );
    return null;
};
