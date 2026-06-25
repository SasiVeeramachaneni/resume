import {
    Anchor,
    Group,
    Image,
    Text
} from '@mantine/core';
import { Link } from 'react-router-dom';
import classes from './CreateResumeLogo.module.css';


export function CreateResumeLogo() {

    return (
        <Anchor component={Link} to="/" underline="never">
            <Group>
                <Image src="/resume.webp" className={classes.image} alt="Create Resume logo" />
                <h3 className={classes.title}>
                    Create<span className={classes.highlight}>
                        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'yellow' }}>
                            Resume
                        </Text></span>.in
                </h3>
            </Group>
        </Anchor>
    );
}