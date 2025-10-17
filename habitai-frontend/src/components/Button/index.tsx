
import styles from './button.module.css';

export function Button({ children, icon, variant = 'primary', size = 'medium', fullWidth = false, ...props }: any) {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : ''
    ].join(' ');

    return (
        <button className={classNames} {...props}>
            {icon}
            {children}
        </button>
    );
};