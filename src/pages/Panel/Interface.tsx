import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import validUrl from 'valid-url'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useAddPopup, useAppState } from 'state/application/hooks'
import { ButtonPrimary } from 'components/Button'
import { TokenLists } from './TokenLists'
import Accordion from 'components/Accordion'
import Input from 'components/Input'
import InputPanel from 'components/InputPanel'
import Toggle from 'components/Toggle'
import ListFactory from 'components/ListFactory'
import MenuLinksFactory, { LinkItem } from 'components/MenuLinksFactory'
import ColorSelector from 'components/ColorSelector'
import NetworkRelatedSettings from './NetworkRelatedSettings'
import { OptionWrapper } from './index'
import { STORAGE_NETWORK_ID, STORAGE_NETWORK_NAME } from '../../constants'
import { saveAppData } from 'utils/storage'
import { parseENSAddress } from 'utils/parseENSAddress'
import uriToHttp from 'utils/uriToHttp'
import networks from 'networks.json'

const Button = styled(ButtonPrimary)`
  font-size: 0.8em;
  margin-top: 0.3rem;
`

const Title = styled.h3`
  font-weight: 400;
  margin: 1.4rem 0 0.6rem;
`

export default function Interface(props: any) {
  const { pending, setPending, activeNetworks } = props
  const { t } = useTranslation()
  const { library, chainId, account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const addPopup = useAddPopup()

  const {
    projectName: stateProjectName,
    logo: stateLogo,
    background: stateBackground,
    brandColor: stateBrandColor,
    backgroundColorDark: stateBackgroundColorDark,
    backgroundColorLight: stateBackgroundColorLight,
    textColorDark: stateTextColorDark,
    textColorLight: stateTextColorLight,
    navigationLinks: stateNavigationLinks,
    menuLinks: stateMenuLinks,
    socialLinks: stateSocialLinks,
    addressesOfTokenLists: stateAddressesOfTokenLists,
    tokenListsByChain: stateTokenListsByChain,
    disableSourceCopyright: stateDisableSourceCopyright,
    defaultSwapCurrency,
  } = useAppState()

  const [projectName, setProjectName] = useState(stateProjectName)
  const [logoUrl, setLogoUrl] = useState(stateLogo)
  const [isValidLogo, setIsValidLogo] = useState(Boolean(validUrl.isUri(stateLogo)))

  useEffect(() => {
    setIsValidLogo(logoUrl ? Boolean(validUrl.isUri(logoUrl)) : true)
  }, [logoUrl])

  const [backgroundUrl, setBackgroundUrl] = useState(stateBackground)
  const [isValidBackground, setIsValidBackground] = useState(Boolean(validUrl.isUri(backgroundUrl)))

  useEffect(() => {
    setIsValidBackground(backgroundUrl ? Boolean(validUrl.isUri(backgroundUrl)) : true)
  }, [backgroundUrl])

  // TODO: how to reduce amount of states ?
  const [brandColor, setBrandColor] = useState(stateBrandColor)
  const [brandColorValid, setBrandColorValid] = useState(false)

  const [backgroundColorDark, setBackgroundColorDark] = useState(stateBackgroundColorDark)
  const [bgColorDarkValid, setBgColorDarkValid] = useState(false)

  const [backgroundColorLight, setBackgroundColorLight] = useState(stateBackgroundColorLight)
  const [bgColorLightValid, setBgColorLightValid] = useState(false)

  const [textColorDark, setTextColorDark] = useState(stateTextColorDark)
  const [textColorDarkValid, setTextColorDarkValid] = useState(false)

  const [textColorLight, setTextColorLight] = useState(stateTextColorLight)
  const [textColorLightValid, setTextColorLightValid] = useState(false)

  enum ColorType {
    BRAND,
    BACKGROUND_LIGHT,
    BACKGROUND_DARK,
    TEXT_COLOR_LIGHT,
    TEXT_COLOR_DARK,
  }

  const updateColor = (value: string, type: ColorType) => {
    switch (type) {
      case ColorType.BRAND:
        setBrandColor(value)
        break
      case ColorType.BACKGROUND_LIGHT:
        setBackgroundColorLight(value)
        break
      case ColorType.BACKGROUND_DARK:
        setBackgroundColorDark(value)
        break
      case ColorType.TEXT_COLOR_LIGHT:
        setTextColorLight(value)
        break
      case ColorType.TEXT_COLOR_DARK:
        setTextColorDark(value)
    }
  }

  const [areColorsValid, setAreColorsValid] = useState(false)

  useEffect(() => {
    setAreColorsValid(
      brandColorValid && bgColorDarkValid && bgColorLightValid && textColorDarkValid && textColorLightValid
    )
  }, [brandColorValid, bgColorDarkValid, bgColorLightValid, textColorDarkValid, textColorLightValid])

  const [navigationLinks, setNavigationLinks] = useState<LinkItem[]>(stateNavigationLinks)
  const [menuLinks, setMenuLinks] = useState<LinkItem[]>(stateMenuLinks)
  const [socialLinks, setSocialLinks] = useState<string[]>(stateSocialLinks)
  const [addressesOfTokenLists, setAddressesOfTokenLists] = useState<string[]>(stateAddressesOfTokenLists)
  const [tokenLists, setTokenLists] = useState<any>(stateTokenListsByChain)
  const [disableSourceCopyright, setDisableSourceCopyright] = useState<boolean>(stateDisableSourceCopyright)
  const [swapInputCurrency, setSwapInputCurrency] = useState(defaultSwapCurrency.input || '')
  const [swapOutputCurrency, setSwapOutputCurrency] = useState(defaultSwapCurrency.output || '')

  const currentStrSettings = JSON.stringify({
    projectName: stateProjectName,
    logoUrl: stateLogo,
    backgroundUrl: stateBackground,
    brandColor: stateBrandColor,
    navigationLinks: stateNavigationLinks,
    menuLinks: stateMenuLinks,
    socialLinks: stateSocialLinks,
    addressesOfTokenLists: stateAddressesOfTokenLists,
    disableSourceCopyright: stateDisableSourceCopyright,
    swapInputCurrency: defaultSwapCurrency.input,
    swapOutputCurrency: defaultSwapCurrency.output,
    backgroundColorDark: stateBackgroundColorDark,
    backgroundColorLight: stateBackgroundColorLight,
    textColorDark: stateTextColorDark,
    textColorLight: stateTextColorLight,
  })

  const [settingsChanged, setSettingsChanged] = useState(false)

  useEffect(() => {
    const newStrSettings = JSON.stringify({
      projectName,
      logoUrl,
      backgroundUrl,
      brandColor,
      navigationLinks,
      menuLinks,
      socialLinks,
      addressesOfTokenLists,
      disableSourceCopyright,
      swapInputCurrency,
      swapOutputCurrency,
      backgroundColorDark,
      backgroundColorLight,
      textColorDark,
      textColorLight,
    })

    setSettingsChanged(newStrSettings !== currentStrSettings)
  }, [
    currentStrSettings,
    projectName,
    logoUrl,
    backgroundUrl,
    brandColor,
    navigationLinks,
    menuLinks,
    socialLinks,
    addressesOfTokenLists,
    disableSourceCopyright,
    swapInputCurrency,
    swapOutputCurrency,
    backgroundColorDark,
    backgroundColorLight,
    textColorDark,
    textColorLight,
  ])

  const [cannotSaveSettings, setCannotSaveSettings] = useState(true)

  useEffect(() => {
    setCannotSaveSettings(
      chainId !== STORAGE_NETWORK_ID || !settingsChanged || !isValidLogo || !isValidBackground || !areColorsValid
    )
  }, [settingsChanged, isValidLogo, isValidBackground, areColorsValid, chainId])

  const saveSettings = async () => {
    setPending(true)

    try {
      const newSettings = {
        projectName,
        logoUrl,
        backgroundUrl,
        brandColor,
        navigationLinks,
        menuLinks,
        socialLinks,
        addressesOfTokenLists,
        disableSourceCopyright,
        defaultSwapCurrency: {
          input: swapInputCurrency,
          output: swapOutputCurrency,
        },
        backgroundColorDark,
        backgroundColorLight,
        textColorDark,
        textColorLight,
      }

      await saveAppData({
        //@ts-ignore
        library,
        owner: account || '',
        data: newSettings,
        onHash: (hash: string) => {
          addTransaction(
            { hash },
            {
              summary: `Chain ${chainId}. Settings saved`,
            }
          )
        },
      })
    } catch (error) {
      addPopup({
        error: {
          message: error.message,
          code: error.code,
        },
      })
    }

    setPending(false)
  }

  const [newListChainId, setNewListChainId] = useState('')
  const [newListId, setNewListId] = useState('templatelist')
  const [canCreateNewList, setCanCreateNewList] = useState(false)

  useEffect(() => {
    setCanCreateNewList(Boolean(networks[newListChainId as keyof typeof networks] && newListId))
  }, [newListChainId, newListId])

  const createNewTokenList = () => {
    setTokenLists((oldData: any) => ({
      ...oldData,
      [newListChainId]: {
        ...oldData[newListChainId],
        [newListId]: {
          name: 'Template list',
          logoURI: '',
          tokens: [],
        },
      },
    }))
  }

  return (
    <section>
      <div className={`${pending ? 'disabled' : ''}`}>
        <OptionWrapper>
          <InputPanel label={`${t('projectName')}`} value={projectName} onChange={setProjectName} />
        </OptionWrapper>

        <OptionWrapper>
          <InputPanel label={`${t('logoUrl')}`} value={logoUrl} onChange={setLogoUrl} error={!isValidLogo} />
        </OptionWrapper>
        <OptionWrapper flex>
          <InputPanel
            label={`${t('backgroundUrl')}`}
            value={backgroundUrl}
            onChange={setBackgroundUrl}
            error={!isValidBackground}
          />
        </OptionWrapper>

        <OptionWrapper flex>
          {t('disableSourceCopyright')}
          <Toggle
            isActive={disableSourceCopyright}
            toggle={() => setDisableSourceCopyright((prevState) => !prevState)}
          />
        </OptionWrapper>

        <OptionWrapper>
          <MenuLinksFactory
            title={t('navigationLinks')}
            items={navigationLinks}
            setItems={setNavigationLinks}
            isValidItem={(item: LinkItem) => Boolean(validUrl.isUri(item.source))}
          />
        </OptionWrapper>

        <OptionWrapper>
          <MenuLinksFactory
            title={t('menuLinks')}
            items={menuLinks}
            setItems={setMenuLinks}
            isValidItem={(item: LinkItem) => Boolean(validUrl.isUri(item.source))}
          />
        </OptionWrapper>

        <OptionWrapper>
          <ListFactory
            title={t('socialLinks')}
            placeholder="https://"
            items={socialLinks}
            setItems={setSocialLinks}
            isValidItem={(address) => Boolean(validUrl.isUri(address))}
          />
        </OptionWrapper>

        <OptionWrapper>
          <ListFactory
            title={t('addressesOfTokenLists')}
            placeholder="https:// or ipfs://"
            items={addressesOfTokenLists}
            setItems={setAddressesOfTokenLists}
            isValidItem={(address) => uriToHttp(address).length > 0 || Boolean(parseENSAddress(address))}
          />
        </OptionWrapper>

        <NetworkRelatedSettings
          activeNetworks={activeNetworks}
          onInputCurrency={setSwapInputCurrency}
          onOutputCurrency={setSwapOutputCurrency}
        />

        <Accordion title={t('colors')} margin="0.5rem 0">
          <OptionWrapper margin={0.4}>
            <ColorSelector
              name={t('primaryColor')}
              defaultColor={stateBrandColor}
              onColor={(color, valid) => {
                setBrandColorValid(valid)
                updateColor(color, ColorType.BRAND)
              }}
            />
          </OptionWrapper>

          <OptionWrapper margin={0.4}>
            <h4>{t('backgroundColor')}</h4>
            <ColorSelector
              name={t('light')}
              defaultColor={backgroundColorLight}
              onColor={(color, valid) => {
                setBgColorLightValid(valid)
                updateColor(color, ColorType.BACKGROUND_LIGHT)
              }}
            />
            <ColorSelector
              name={t('dark')}
              defaultColor={backgroundColorDark}
              onColor={(color, valid) => {
                setBgColorDarkValid(valid)
                updateColor(color, ColorType.BACKGROUND_DARK)
              }}
            />
          </OptionWrapper>

          <OptionWrapper margin={0.5}>
            <h4>{t('textColor')}</h4>
            <ColorSelector
              name={t('light')}
              defaultColor={textColorLight}
              onColor={(color, valid) => {
                setTextColorLightValid(valid)
                updateColor(color, ColorType.TEXT_COLOR_LIGHT)
              }}
            />
            <ColorSelector
              name={t('dark')}
              defaultColor={textColorDark}
              onColor={(color, valid) => {
                setTextColorDarkValid(valid)
                updateColor(color, ColorType.TEXT_COLOR_DARK)
              }}
            />
          </OptionWrapper>
        </Accordion>

        <Button onClick={saveSettings} disabled={cannotSaveSettings}>
          {t(chainId === STORAGE_NETWORK_ID ? 'saveSettings' : 'switchToNetwork', {
            network: STORAGE_NETWORK_NAME,
          })}
        </Button>

        <Title>{t('tokenLists')}</Title>
        <TokenLists pending={pending} setPending={setPending} tokenLists={tokenLists} />

        <OptionWrapper margin={0.4}>
          <Input
            label={`${t('listNetworkId')} *`}
            questionHelper={t('listNetworkIdDescription')}
            value={newListChainId}
            onChange={setNewListChainId}
          />
          <Input
            label={`${t('listId')} *`}
            questionHelper={t('listIdDescription')}
            value={newListId}
            onChange={setNewListId}
          />
          <Button disabled={!canCreateNewList} onClick={createNewTokenList}>
            {t('createNewTokenList')}
          </Button>
        </OptionWrapper>
      </div>
    </section>
  )
}
