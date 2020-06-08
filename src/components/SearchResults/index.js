import { useState, useEffect, cloneElement } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import useTranslation from 'next-translate/useTranslation'

import axios from 'axios'

import { map, isEmpty } from 'lodash'

import {
    Box,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    Divider,
} from '@material-ui/core'

import {
    ArrowForward,
} from '@material-ui/icons'

import {
    Pagination,
} from '@material-ui/lab'

import {
    PAGE_SIZE,
} from '../../config/constants'

import AvatarIcon from '../../components/AvatarIcon'

export default function SearchResults({
    endpoint = "",
    itemId = "",
    itemType = "",
    children,
}) {

    const router = useRouter()
    const { t, lang } = useTranslation()

    const [items, setItems] = useState([])
    const [results, setResults] = useState(0)
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)

    function handleChangePage(e, value) {
        setPage(value)
    }

    function handleRequest() {
        axios
            .get(
                endpoint,
                {
                    params: {
                        page: page - 1,
                    }
                }
            )
            .then(
                res => {
                    setResults(res.data.total.value)
                    setItems(map(res.data.hits, "_source"))
                }
            )
    }

    useEffect(() => {
        handleRequest()
    }, [page])

    useEffect(() => {
        setPages(Math.floor(results / PAGE_SIZE) + (results % PAGE_SIZE ? 1 : 0))
    }, [results])

    return (
        <Grid container>
            <Grid item xs={12}>
                {
                    !isEmpty(items)
                        ?
                        <>

                            {
                                pages > 1
                                &&
                                <Pagination
                                    variant="outlined" shape="rounded"
                                    page={page} count={pages}
                                    onChange={handleChangePage}
                                />
                            }

                            <List>
                                {
                                    map(
                                        items,
                                        (item, index) => (
                                            <Box component="li" key={item[itemId]}>
                                                {!!index && <Divider />}
                                                <Link href={`/[lang]/${itemType}/[id]`} as={`/${lang}/${itemType}/${item[itemId]}`}>
                                                    <ListItem button>
                                                        <ListItemIcon>
                                                            <AvatarIcon color="primary"><ArrowForward /></AvatarIcon>
                                                        </ListItemIcon>
                                                        {cloneElement(children, item)}
                                                    </ListItem>
                                                </Link>
                                            </Box>
                                        )
                                    )
                                }
                            </List>

                            {
                                pages > 1
                                &&
                                <Pagination
                                    variant="outlined" shape="rounded"
                                    page={page} count={pages}
                                    onChange={handleChangePage}
                                />
                            }

                        </>
                        :
                        <Typography>{t("common:search.noResults")}</Typography>
                }
            </Grid>
        </Grid>

    )

}
