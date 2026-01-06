from selenium import webdriver
from selenium.webdriver.common.by import By
import requests
import io
from PIL import Image
import pandas as pd
import numpy as np
from time import sleep

driver = webdriver.Chrome()
driver.get('https://www.amazon.com/AMD-5500-12-Thread-Unlocked-Processor/dp/B09VCJ171S/ref=sr_1_1?crid=3GHU4E08PR3WW&dib=eyJ2IjoiMSJ9.Xo4mmjPW4CribnpuZWZbwfOVlxuQN19QzgHJM2H23IznsGlEcM-EeRGpch1bleqcCjkfbvGttw0Gr6Fn-2rk2c4yrXkehbVcqMvSzGd98EL-FAYZ4vFN4FPIzwsNl2vbDUKspUr0R9kxuEcl6EvTluXidrMStN_wLoae7m0vglyWrSzbF5kDcdVyXEJHsMACP-g39y3etl145PUDMmMItgJSO108RluPZIwfQjd_On4.9ewfRH0H9MINRY5NbSncs73dy2KlTSf8nriT9Vcj7VA&dib_tag=se&keywords=processor+pc&qid=1767094548&s=computers-intl-ship&sprefix=processor+pc%2Ccomputers-intl-ship%2C382&sr=1-1')

search_button = driver.find_element("xpath","//div[id='imgTagWrapperId']/img")
sleep(1)

search_button.click()
sleep(5)

def get_amazon_image_link(url):
    # Set up Chrome driver (you need to specify the path to your chromedriver executable)
    driver = webdriver.Chrome()
    
    try:
        # Navigate to the Amazon product page
        driver.get(url)
        search_button= driver.find_element("xpath","//div[@id='imgTagWrapperId']/img")
        sleep(1)

        search_button.click()
        sleep(1)
        # Define the XPath for the image (update based on the actual HTML structure)
        xpath_expression = '//img[@class="fullscreen"]'

        # Find the image element using the XPath
        image_element = driver.find_element(By.XPATH, xpath_expression)

        # Extract the image URL
        if image_element:
            image_link = image_element.get_attribute('src')
            return image_link
        else:
            return "Image not found on the page."

    finally:
        # Close the browser window
        driver.quit()

amazon_url = "https://www.amazon.com/AMD-5500-12-Thread-Unlocked-Processor/dp/B09VCJ171S/ref=sr_1_1?crid=3GHU4E08PR3WW&dib=eyJ2IjoiMSJ9.Xo4mmjPW4CribnpuZWZbwfOVlxuQN19QzgHJM2H23IznsGlEcM-EeRGpch1bleqcCjkfbvGttw0Gr6Fn-2rk2c4yrXkehbVcqMvSzGd98EL-FAYZ4vFN4FPIzwsNl2vbDUKspUr0R9kxuEcl6EvTluXidrMStN_wLoae7m0vglyWrSzbF5kDcdVyXEJHsMACP-g39y3etl145PUDMmMItgJSO108RluPZIwfQjd_On4.9ewfRH0H9MINRY5NbSncs73dy2KlTSf8nriT9Vcj7VA&dib_tag=se&keywords=processor+pc&qid=1767094548&s=computers-intl-ship&sprefix=processor+pc%2Ccomputers-intl-ship%2C382&sr=1-1"

image_link = get_amazon_image_link(amazon_url)

print(f"Image Link: {image_link}")