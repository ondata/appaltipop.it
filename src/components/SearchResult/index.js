import { useEffect, useState } from "react"

import useTranslation from "next-translate/useTranslation"

import axios from "axios"

import { map, isEmpty, startCase, toLower, upperFirst, toUpper } from "lodash"

import { Grid, Typography } from "@material-ui/core"

import { Flag } from "@material-ui/icons"

import { numberFormat, timeFormat } from "../../utils/formats"

import {
    CURRENCY_FORMAT,
    DATE_FORMAT,
    INTEGER_FORMAT,
    API_VERSION,
} from "../../config/constants"

import { makeStyles } from "@material-ui/core/styles"

import style from "./style"
const useStyles = makeStyles(style)

export function Buyer(buyer) {
    const classes = useStyles()
    const { t, lang } = useTranslation()

    const [tenders, setTenders] = useState(0)
    const [redflags, setRedflags] = useState(0)

    useEffect(() => {
        axios
            .get(
                `/api/${API_VERSION}/buyers/${buyer["ocds:releases/0/buyer/id"]}/tenders/count`
            )
            .then((res) => {
                setTenders(+res.data)
            })

        axios
            .get(
                `/api/${API_VERSION}/buyers/${buyer["ocds:releases/0/buyer/id"]}/redflags/count`
            )
            .then((res) => {
                setRedflags(+res.data)
            })
    }, [])

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm>
                {/*<Typography variant="caption">{t("buyer:ocds/releases/0/buyer/name")}</Typography>*/}
                <Typography variant="body1">
                    {buyer["ocds:releases/0/buyer/name"]}
                </Typography>
            </Grid>
            <Grid item xs={6} sm="auto">
                <Typography variant="caption">{t("common:tenders")}</Typography>
                <Typography variant="body1">{tenders || "-"}</Typography>
            </Grid>
            <Grid item xs={6} sm="auto">
                <Typography variant="caption">
                    {t("common:redflags")}
                </Typography>
                <Typography variant="body1">
                    {redflags ? (
                        <>
                            {redflags}{" "}
                            <Flag
                                color="secondary"
                                style={{ marginBottom: -5 }}
                            />
                        </>
                    ) : (
                        "-"
                    )}
                </Typography>
            </Grid>
        </Grid>
    )
}

export function Supplier(supplier) {
    const classes = useStyles()
    const { t, lang } = useTranslation()

    const [tenders, setTenders] = useState(0)
    const [redflags, setRedflags] = useState(0)

    useEffect(() => {
        axios
            .get(
                `/api/${API_VERSION}/suppliers/${supplier["ocds:releases/0/parties/0/id"]}/tenders/count`
            )
            .then((res) => {
                setTenders(+res.data)
            })

        axios
            .get(
                `/api/${API_VERSION}/suppliers/${supplier["ocds:releases/0/parties/0/id"]}/redflags/count`
            )
            .then((res) => {
                setRedflags(+res.data)
            })
    }, [])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm="auto">
                <Typography variant="caption">
                    {t("supplier:ocds/releases/0/parties/0/id")}
                </Typography>
                <Typography variant="body1">
                    {supplier["ocds:releases/0/parties/0/id"]}
                </Typography>
            </Grid>
            <Grid item xs={12} sm>
                <Typography variant="caption">
                    {t("supplier:ocds/releases/0/parties/0/name")}
                </Typography>
                <Typography variant="body2">
                    {startCase(
                        toLower(supplier["ocds:releases/0/parties/0/name"])
                    )}
                </Typography>
            </Grid>
            <Grid item xs={4} sm="auto">
                <Typography variant="caption">{t("common:tenders")}</Typography>
                <Typography variant="body1">{tenders || "-"}</Typography>
            </Grid>
            <Grid item xs={6} sm="auto">
                <Typography variant="caption">
                    {t("common:redflags")}
                </Typography>
                <Typography variant="body1">
                    {redflags ? (
                        <>
                            {redflags}{" "}
                            <Flag
                                color="secondary"
                                style={{ marginBottom: -5 }}
                            />
                        </>
                    ) : (
                        "-"
                    )}
                </Typography>
            </Grid>
        </Grid>
    )
}

export function Tender(tender) {
    const classes = useStyles()
    const { t, lang } = useTranslation()

    const nf = numberFormat(lang).format
    const tf = timeFormat(lang).format

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm="auto">
                <Typography variant="caption">
                    {t("tender:ocds/releases/0/id")}
                </Typography>
                <Typography variant="body1">
                    {tender["ocds:releases/0/id"]}
                </Typography>

                <Typography variant="caption">
                    {t("common:redflags")}
                </Typography>
                <Typography variant="body1">
                    {isEmpty(tender["appaltipop:releases/0/redflags"])
                        ? "-"
                        : map(
                              tender["appaltipop:releases/0/redflags"],
                              (flag) => (
                                  <Flag
                                      key={
                                          flag[
                                              "appaltipop:releases/0/redflag/code"
                                          ]
                                      }
                                      color="secondary"
                                  />
                              )
                          )}
                </Typography>
            </Grid>

            <Grid item xs={12} sm>
                <Typography variant="caption">
                    {t("tender:ocds/releases/0/tender/title")}
                </Typography>
                <Typography variant="body2">
                    {upperFirst(
                        toLower(tender["ocds:releases/0/tender/title"])
                    )}
                </Typography>
            </Grid>

            <Grid item xs={6} sm>
                <Typography variant="caption">
                    {t("common:buyer", {
                        count: tender["appaltipop:releases/0/buyers"].length,
                    })}
                </Typography>
                {map(tender["appaltipop:releases/0/buyers"], (buyer) => (
                    <Typography
                        key={buyer["ocds:releases/0/buyer/id"]}
                        variant="body1"
                    >
                        {toUpper(buyer["ocds:releases/0/buyer/name"])}
                    </Typography>
                ))}

                <Typography variant="caption">
                    {t("tender:ocds/releases/0/awards/0/value/amount")}
                </Typography>
                <Typography variant="body1">
                    {tender["ocds:releases/0/awards/0/value/amount"]
                        ? nf(CURRENCY_FORMAT)(
                              tender["ocds:releases/0/awards/0/value/amount"]
                          )
                        : "-"}
                </Typography>
            </Grid>

            <Grid item xs={6} sm="auto">
                <Typography variant="caption">
                    {t(
                        "tender:ocds/releases/0/tender/contractPeriod/startDate"
                    )}
                </Typography>

                <Typography variant="body1">
                    {tender["ocds:releases/0/tender/contractPeriod/startDate"]
                        ? tf(DATE_FORMAT)(
                              new Date(
                                  tender[
                                      "ocds:releases/0/tender/contractPeriod/startDate"
                                  ]
                              )
                          )
                        : "-"}
                </Typography>

                <Typography variant="caption">
                    {t("tender:ocds/releases/0/tender/contractPeriod/endDate")}
                </Typography>
                <Typography variant="body1">
                    {tender["ocds:releases/0/tender/contractPeriod/endDate"]
                        ? tf(DATE_FORMAT)(
                              new Date(
                                  tender[
                                      "ocds:releases/0/tender/contractPeriod/endDate"
                                  ]
                              )
                          )
                        : "-"}
                </Typography>
            </Grid>
        </Grid>
    )
}
